/*
 * Copyright (c) 2019, Dubo Dubon Duponey <dubodubonduponey+github@pm.me>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import <Cocoa/Cocoa.h>
#import <Foundation/Foundation.h>

#include "helper.h"
#include "cocoainit.h"
#include "macnotifier.h"

/*
// Hide away platform details
class NativeNotifier::Private
{
    public:
        id NotificationCenterWrapped;
};
*/

@interface DuboNotifyNotificationCenterDelegate : NSObject <NSUserNotificationCenterDelegate> {
}

  @property (atomic) NativeNotifier* observer;
- (DuboNotifyNotificationCenterDelegate*) initialise:(NativeNotifier*)observer;
- (void) userNotificationCenter:(NSUserNotificationCenter *)center didDeliverNotification:(NSUserNotification *)notification;
- (void) userNotificationCenter:(NSUserNotificationCenter *)center didActivateNotification:(NSUserNotification *)notification;
- (BOOL) userNotificationCenter:(NSUserNotificationCenter *)center shouldPresentNotification:(NSUserNotification *)notification;
@end

@implementation DuboNotifyNotificationCenterDelegate{
}

- (DuboNotifyNotificationCenterDelegate*) initialise:(NativeNotifier*)obs
{
    if ( (self = [super init]) )
        self.observer = obs;
    return self;
}

- (void) userNotificationCenter:(NSUserNotificationCenter *)center didDeliverNotification:(NSUserNotification *)notification
{
    Q_UNUSED(center);
    self.observer->notificationDelivered(notification);
}

- (void) userNotificationCenter:(NSUserNotificationCenter *)center didActivateNotification:(NSUserNotification *)notification
{
    Q_UNUSED(center);
    self.observer->notificationClicked(notification);
}

- (BOOL) userNotificationCenter:(NSUserNotificationCenter *)center shouldPresentNotification:(NSUserNotification *)notification
{
    Q_UNUSED(center);
    Q_UNUSED(notification);
    return YES;
}

@end

NativeNotifier::NativeNotifier(DuboNotify::Notifier *parent) : OSNotifier(parent)
{
    CocoaInitializer initializer;

    // Instanciate the delegate
    DuboNotifyNotificationCenterDelegate * delegate = [[DuboNotifyNotificationCenterDelegate alloc] initialise: this];

    // Store it
    /*d = new NativeNotifier::Private();
    d->NotificationCenterWrapped = delegate;*/

    // Set it as delegate
    [[NSUserNotificationCenter defaultUserNotificationCenter] setDelegate:delegate];

    // Should we do that when booting?
    // this->clean();
}

NativeNotifier::~NativeNotifier()
{
    // Should we do that when stopping?
    // this->clean();
}

void NativeNotifier::notificationDelivered(id notification)
{
    NSUserNotification * notif = notification;

    // Get the notifier
    DuboNotify::Notifier * notifier = qobject_cast<DuboNotify::Notifier *>(this->parent());
    // Get a notification object (either from cache, or build a new one)
    DuboNotify::Notification * n = notifier->read(toQString([notif identifier]));

    // Set the userInfo in case it's a new object
    QMap<QString, QString> info = QMap<QString, QString>();
    for(id key in [notif userInfo]){
        // NSLog(@"key=%@ value=%@", key, [[notif userInfo] objectForKey:key]);
        info[toQString(key)] = toQString([[notif userInfo] objectForKey:key]);
    }
    n->UserInfo = info;

    // Emit
    emit notifier->presented(n);
}

void NativeNotifier::notificationClicked(id notification)
{
    NSUserNotification * notif = notification;

    // Get the notifier
    DuboNotify::Notifier * notifier = qobject_cast<DuboNotify::Notifier *>(this->parent());
    // Get a notification object (either from cache, or build a new one)
    DuboNotify::Notification * n = notifier->read(toQString([notif identifier]));

    // Set the userInfo in case it's a new object
    QMap<QString, QString> info = QMap<QString, QString>();
    for(id key in [notif userInfo]){
        // NSLog(@"key=%@ value=%@", key, [[notif userInfo] objectForKey:key]);
        info[toQString(key)] = toQString([[notif userInfo] objectForKey:key]);
    }
    n->UserInfo = info;
    emit n->updated();

    // Client should assume it doesn't necessarily get these, which are purely informative and should not contain data
    /*    n->Title = toQString([notification title]);
        n->Subtitle = toQString([notification subtitle]);
        n->Informative = toQString([notification informativeText]);
    //    n->SoundName = toQString([notification soundName]);
    //    n->HasReplyButton = [notification hasReplyButton];
    //    n->HasActionButton = [notification hasActionButton];
    //    n->OtherButtonTitle = toQString([notification otherButtonTitle]);
    */

    // Set properties pertaining to the response
    n->Response = toQString([[notif response] string]);
    n->AdditionalActivationAction = toQString([[notif additionalActivationAction] identifier]);
    n->ActivationType = DuboNotify::Notification::NotificationActivation([notif activationType]);

    // Let it known that a notification has been clicked (it doesn't matter where this is sent, because it always arrives first...)
    emit notifier->clicked(n);
    // Then let it known that the notification has been activated...
    emit n->activated();
    /*
    [notification actualDeliveryDate];
    [notification isPresented];
    [notification isRemote];
    */
}

bool NativeNotifier::dispatch(DuboNotify::Notification * data)
{
    // Create the nofication
    // Class userNotificationClass     = NSClassFromString(@"NSUserNotification");
    NSUserNotification * userNotification             = [[NSUserNotification alloc] init];

    // Set standard values
    [userNotification setValue:toNSString(data->Title) forKey:@"title"];
    [userNotification setValue:toNSString(data->Subtitle) forKey:@"subtitle"];
    [userNotification setValue:toNSString(data->Informative) forKey:@"informativeText"];
    [userNotification setValue:toNSString(data->Identifier) forKey:@"identifier"];
    [userNotification setValue:toNSString(data->ResponsePlaceholder) forKey:@"responsePlaceholder"];

    QString soundName = data->getSoundName(data->SoundName);
    if (soundName.length() > 0){
        [userNotification setValue:toNSString(soundName) forKey:@"soundName"];
    }else{
        [userNotification setValue:nullptr forKey:@"soundName"];
    }

    [userNotification setValue:@(data->HasReplyButton) forKey:@"hasReplyButton"];
    [userNotification setValue:@(data->HasActionButton) forKey:@"hasActionButton"];
    [userNotification setValue:toNSString(data->OtherButtonTitle) forKey:@"otherButtonTitle"];

    // Handle the possible actions
    if (data->HasActionButton && !data->HasReplyButton){
        [userNotification setValue:toNSString(data->ActionButtonTitle) forKey:@"actionButtonTitle"];
        if (data->AdditionalActions.length() > 0){
            NSMutableArray * actions = [[NSMutableArray alloc] init];
            for (int i = 0; i < data->AdditionalActions.length(); ++i) {
                // Class userNotificationActionClass = NSClassFromString(@"NSUserNotificationAction");
                NSUserNotificationAction * action ;
                action = [[NSUserNotificationAction alloc] init];
                [action setValue:toNSString(data->AdditionalActions[i]) forKey:@"identifier"];
                [action setValue:toNSString(data->AdditionalActions[i]) forKey:@"title"];
                [actions addObject:action];
            }
            [userNotification setValue:actions forKey:@"additionalActions"];
        }
        // XXX private API!
        [userNotification setValue:@(data->_showAlternate) forKey:@"_alwaysShowAlternateActionMenu"];
    }

    if (!data->Icon->isNull()){
        [userNotification setValue:toNSImage(* data->Icon) forKey:@"contentImage"];
    }

    QMap<QString, QString>::const_iterator i = data->UserInfo.constBegin();
    NSMutableDictionary * userInfo = [[NSMutableDictionary alloc] init];
    while (i != data->UserInfo.constEnd()) {
        userInfo[toNSString(i.key())] = toNSString(i.value());
        ++i;
    }

    [userNotification setUserInfo:userInfo];

    // Dispatch
    NSUserNotificationCenter *notificationCenter = [NSUserNotificationCenter defaultUserNotificationCenter];
    [notificationCenter deliverNotification:userNotification];
    return true;
}

bool NativeNotifier::remove(const QString &identifier)
{
    NSUserNotificationCenter *notificationCenter = [NSUserNotificationCenter defaultUserNotificationCenter];
    for (NSUserNotification *deliveredUserNotification in [notificationCenter deliveredNotifications])
    {
        if(toQString([deliveredUserNotification identifier]) == identifier){
            [notificationCenter removeDeliveredNotification:deliveredUserNotification];
            return true;
        }
    }
    return false;
}

void NativeNotifier::clean()
{
    [[NSUserNotificationCenter defaultUserNotificationCenter] removeAllDeliveredNotifications];
}

bool NativeNotifier::test()
{
    return NSClassFromString(@"NSUserNotificationCenter") != nil;
}
