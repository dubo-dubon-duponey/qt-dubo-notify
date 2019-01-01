# DuboNotify

> "Dubo Components" are lightweight, targeted c++ libraries meant for QT applications.
> They aim at providing *simple to use* interfaces for a range of functionality
(notification, crash reporting, zero conf, application update, torrent, etc).
> Fully scriptable, they are primarily meant for javascript (from a QWebEngine) - thought they are usable as well in plain QT.
> Put together, these components should provide a comprehensive foundation for these building a "WebRunner", similarly to Electron.

DuboNotify is a (tentatively) cross-platform notification library.

macOS only for now.

Licensed under BSD2.

## How to use

1. Build the library (static by default, see project.pri to change it to a shared library if you need)
2. Link it into your app
```
LIBS += -ldubonotify
# If linking statically
DEFINES += LIBDUBONOTIFY_USE_STATIC
```
3. Use it
```
DuboNotify::Notifier * n = new DuboNotify::Notifier(parentObject);
DuboNotify::Notification * notif = new DuboNotify::Notification(n);
notif->Title = "foo";
n->dispatch(notif);
```

For more, see main.cpp in the demo repository.

## API

Notifier

## WebView use


## Gotchas

1. In order for "actions" to work on notifications, you need to:

    * code-sign your application
    * set NSUserNotificationAlertStyle to "alert" in your application plist

Alternatively, you can manually change the notifications preferences for your application to "alert" in system preferences

More:

    * https://stackoverflow.com/questions/16029755/nsusernotificationalertstyle-plist-key-not-working
    * https://github.com/Daij-Djan/DDMountainNotifier/issues/3
    * https://stackoverflow.com/questions/11676017/nsusernotification-not-showing-action-button

2. We do use and expose one private API: _alwaysShowAlternateActionMenu. It allows for AdditionalActions to be more "visible".


## Documentation of interest

 * https://developer.apple.com/documentation/foundation/nsusernotification
 * https://blog.gaelfoppolo.com/user-notifications-in-macos-66c25ed5c692
 * https://stackoverflow.com/questions/19897342/create-notification-with-reply-field
 * push example: https://developer.apple.com/library/content/samplecode/PushyMac/Listings/PushyMac_PushyMacAppDelegate_m.html#//apple_ref/doc/uid/DTS40011126-PushyMac_PushyMacAppDelegate_m-DontLinkElementID_4
 * private APIs: https://github.com/indragiek/NSUserNotificationPrivate
 * private APIs: https://github.com/mstg/OSX-Runtime-Headers/blob/master/Foundation/NSUserNotification.h
 * useful helpers: https://github.com/Vacuum-IM/macintegration

## TODO

 * delivery timing
 * push notifications
 * custom app bundled sounds
 * https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification

