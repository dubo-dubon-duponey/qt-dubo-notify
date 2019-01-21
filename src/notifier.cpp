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

#include "libdubonotify/notifier.h"
#include <QMessageBox>
#include <QStyle>
#include <QApplication>
#include "osnotifier.h"

#ifdef Q_OS_MAC
#include "mac/macnotifier.h"
#elif defined(Q_OS_UNIX) && defined(Q_DBUS_EXPORT)
#include "nux/specialnotifiernux.h"
#else
class SpecialNotifier : public DuboPlatipus::OSNotifier
{
public:
    explicit SpecialNotifier(QObject * parent = nullptr): DuboPlatipus::OSNotifier(parent)
    {

    }
};
#endif

namespace DuboNotify{

class Notifier::Private
{
    public:
        QMap<QString, DuboNotify::Notification *> notificationsMap = QMap<QString, DuboNotify::Notification *>();
        OSNotifier * notifier;
};

Notifier::Notifier(QObject * parent/*, QSystemTrayIcon * tray*/):
    QObject(parent)/*, trayicon(tray)*/
{
    d = new Notifier::Private();
    // Use the implementation for the OS
    d->notifier = new MacNotifier(this);
}

/*
bool Notifier::canNotify()
{
    return d->notifier->canNotify() || QSystemTrayIcon::supportsMessages();
}
*/

bool Notifier::dispatch(Notification * notification)
{
    d->notificationsMap[notification->Identifier] = notification;
    d->notifier->dispatch(notification);
    return true;
}

bool Notifier::remove(const QString &identifier)
{
    d->notifier->remove(identifier);
    QMap<QString, DuboNotify::Notification*>::iterator i = d->notificationsMap.find(identifier);
    if (i == d->notificationsMap.constEnd())
        return false;
    d->notificationsMap.erase(i);
    return true;
}

bool Notifier::removeAll()
{
    d->notifier->clean();
    d->notificationsMap = QMap<QString, DuboNotify::Notification *>();
    return true;
}

Notification * Notifier::read(const QString &identifier)
{
    if (!d->notificationsMap.contains(identifier)){
        Notification * n = new Notification(this);
        n->Identifier = identifier;
        d->notificationsMap[identifier] = n;
    }
    return d->notificationsMap[identifier];
}

QVariant Notifier::create()
{
    return QVariant::fromValue(static_cast<QObject *>(new Notification(this)));
}

/*
void Notifier::notify3(QObject * parent, Notification * notification)
{
    notifier->notify3(parent, notification);
}

void Notifier::notify2(Notification * notification)
{
    QIcon iconic;
    if(!notification->Icon.isNull()){
        iconic = QIcon(notification->Icon);
    }else{
*/
/*        switch((QSystemTrayIcon::MessageIcon) severity)
        {
        case QSystemTrayIcon::Information:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxInformation);
            break;
        case QSystemTrayIcon::Warning:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxWarning);
            break;
        case QSystemTrayIcon::Critical:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxCritical);
            break;
        default:
            iconic = QIcon();
            break;
        }*/
/*    }

    bool result = notifier->notify2(notification);
    if(result)
        return;
        */
/*
    // Fallback to trayicon implementation if above didn't do anything
    if(trayicon && trayicon->supportsMessages())
    {
        trayicon->showMessage(notification->Title, notification->Informative, QSystemTrayIcon::MessageIcon(severity));
        return;
    }

    if(severity == this->CRITICAL()){
        QMessageBox::critical(0, title, text, QMessageBox::Ok, QMessageBox::Ok);
    }*/

/*}

void Notifier::notify(
        const QString & appName,
        const QString & title,
        const QString & subtitle,
        const QString & text,
        const QPixmap & icon,
        const int & severity,
        const int & time)
{
    QIcon iconic;
    if(!icon.isNull()){
        iconic = QIcon(icon);
    }else{
        switch((QSystemTrayIcon::MessageIcon) severity)
        {
        case QSystemTrayIcon::Information:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxInformation);
            break;
        case QSystemTrayIcon::Warning:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxWarning);
            break;
        case QSystemTrayIcon::Critical:
            iconic = QApplication::style()->standardIcon(QStyle::SP_MessageBoxCritical);
            break;
        default:
            iconic = QIcon();
            break;
        }
    }

    bool result = notifier->notify(appName, title, subtitle, text, iconic, time);
    if(result)
        return;

    // Fallback to trayicon implementation if above didn't do anything
    if(trayicon && trayicon->supportsMessages())
    {
        trayicon->showMessage(title, text, QSystemTrayIcon::MessageIcon(severity));
        return;
    }

    if(severity == this->CRITICAL()){
        QMessageBox::critical(0, title, text, QMessageBox::Ok, QMessageBox::Ok);
    }
}
*/
}
