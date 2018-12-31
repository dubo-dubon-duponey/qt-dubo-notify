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

#ifndef DUBONOTIFY_NOTIFIER_H
#define DUBONOTIFY_NOTIFIER_H

#include "global.h"
#include <QObject>
#include <QVariant>
#include "notification.h"

/*! \namespace DuboNotify
\brief The library namespace.
*/
namespace DuboNotify
{

/*!
  \brief The main object controlling notifications lifecycle (creation, dispatching, removal).
  All methods are q_invokable, and support or return QVariant for notifications.
  Notifications can also be created invoking the constructor directly, and dispatched using dispatch to avoid q_variant casting.
  Signaled are called if the notification is presented to the user, or if the user interacts with the notification (except if the user closes it).
  Dispatched notifications can also be removed individually, or all at once.
  Notifications identifiers should be unique.
*/
class LIBDUBONOTIFYSHARED_EXPORT Notifier : public QObject
{
  Q_OBJECT

public:
    explicit Notifier(QObject * parent = nullptr);

    /*! \brief Create a new blank notification and returns it.*/
    Q_INVOKABLE QVariant create();
    /*! \brief Dispatch a notification to the user.*/
    Q_INVOKABLE bool dispatch(QVariant notification);
    /*! \brief Dispatch a notification to the user.*/
    bool dispatch(Notification * notification);
    /*! \brief Remove a notification.*/
    Q_INVOKABLE bool remove(const QString &identifier);
    /*! \brief Remove all notifications.*/
    Q_INVOKABLE bool removeAll();

    /*! \cond */
    Notification * read(const QString &identifier);
    /*! \endcond */

private:
    class Private;
    Private* d;

signals:
    void clicked(DuboNotify::Notification * n);
    void presented(DuboNotify::Notification * n);


    // QSystemTrayIcon * trayicon;
    /*
    Q_PROPERTY(int APP READ APP)
    static int APP(){return QSystemTrayIcon::NoIcon;}
    Q_PROPERTY(int INFO READ INFO)
    static int INFO(){return QSystemTrayIcon::Information;}
    Q_PROPERTY(int WARNING READ WARNING)
    static int WARNING(){return QSystemTrayIcon::Warning;}
    Q_PROPERTY(int CRITICAL READ CRITICAL)
    static int CRITICAL(){return QSystemTrayIcon::Critical;}
    Q_INVOKABLE bool canNotify();
    */

};

}

#endif // DUBONOTIFY_NOTIFIER_H
