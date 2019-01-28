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

#ifndef DUBONOTIFY_NOTIFICATION_H
#define DUBONOTIFY_NOTIFICATION_H

#include "global.h"

#include <QObject>
#include <QPixmap>
#include <QBuffer>
#include <QMap>
#include <QVariant>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>

/*! \namespace DuboNotify
\brief The library namespace.
*/
namespace DuboNotify {

/*!
  \brief An object representing a notification.
  All macOS properties are exposed.
  ActivationTypes and Sounds are provided as enum.
  Custom sounds are not supported for now.
  UserInfo support a map of strings (in javascript, an object with string values), and can be used to attach random information before sending the notification.

  In case the user interacts with a notification that was sent before the app launch, only certain values are guaranteed to be there, specifically:
    - Identifier
    - Response
    - ActivationType
    - AdditionalActivationAction
    - UserInfo
*/
class LIBDUBONOTIFYSHARED_EXPORT Notification : public QObject
{
    Q_OBJECT

public:
    explicit Notification(QObject * parent):QObject(parent){
        netManager = new QNetworkAccessManager();
//        connect(&netManager, SIGNAL (finished(QNetworkReply*)), this, SLOT (iconDownloaded(QNetworkReply*)));
        connect(netManager, SIGNAL (finished(QNetworkReply*)), this, SLOT (iconDownloaded(QNetworkReply*)));
    }

    /*! \brief The "title".*/
    Q_PROPERTY(QString  Title               MEMBER Title                NOTIFY updated)

    /*! \brief The "subtitle".*/
    Q_PROPERTY(QString  Subtitle            MEMBER Subtitle             NOTIFY updated)

    /*! \brief Some additional informative text.*/
    Q_PROPERTY(QString  Informative         MEMBER Informative          NOTIFY updated)

    /*! \brief A unique identifier. Notifications with the same identifier will only be presented one at a time. */
    Q_PROPERTY(QString  Identifier          MEMBER Identifier           NOTIFY updated)

    /*! \brief If this is a "replyable" notification, the placeholder text in the response text field.*/
    Q_PROPERTY(QString  ResponsePlaceholder MEMBER ResponsePlaceholder  NOTIFY updated)
    Q_PROPERTY(QString  ActionButtonTitle   MEMBER ActionButtonTitle    NOTIFY updated)

    /*! \brief If the notification is "actionable", the title of the "close" button. */
    Q_PROPERTY(QString  OtherButtonTitle    MEMBER OtherButtonTitle     NOTIFY updated)

    /*! \brief A soundname (see sounds). */
    Q_PROPERTY(NotificationSound    Sound   MEMBER SoundName            NOTIFY updated)

    /*! \brief An icon.*/
    Q_PROPERTY(QString  Icon                READ getIcon WRITE setIcon  NOTIFY iconReady)

    /*! \brief Actionable notifications may present additional sub actions (list of strings), displayed when clicking the main action button. */
    Q_PROPERTY(QVariant AdditionalActions   READ getAdditionalActions   WRITE setAdditionalActions
                                                                        NOTIFY updated)

    /*! \brief A map of strings usable to attach information to the notification (typically, user information). */
    Q_PROPERTY(QVariant UserInfo            READ getUserInfo            WRITE setUserInfo
                                                                        NOTIFY updated)

    /*! \brief If the notification should be "actionable", set this to true. Ignored if the notification is "replyable".*/
    Q_PROPERTY(bool     HasActionButton     MEMBER HasActionButton      NOTIFY updated)

    /*! \brief If the notification should be "replyable", set this to true.*/
    Q_PROPERTY(bool     HasReplyButton      MEMBER HasReplyButton       NOTIFY updated)

    /*! \brief If the notification is "actionable", the title of the action button. */
    /*! \brief For actionable notifications with additional actions, whether to force the main action button to display as a dropdown. */
    Q_PROPERTY(bool     _showAlternate      MEMBER _showAlternate       NOTIFY updated)

    /*! \brief If the notification is replyable, will hold the user answer. */
    Q_PROPERTY(QString  Response            READ getResponse            NOTIFY activated)

    /*! \brief If the notification has been activated through an additional action, this holds "which" action. */
    Q_PROPERTY(QString  AdditionalActivationAction                      READ getAdditionalActivationAction
                                                                        NOTIFY activated)

    /*! \brief If the notification has been activated, the "type" of activation (see activation consts). */
    Q_PROPERTY(NotificationActivation ActivationType                    READ getActivationType
                                                                        NOTIFY activated)

    /*! \brief Describes the different possible activation types */
    enum NotificationActivation {
        /*! \brief User has not interacted with the notification (yet?). */
        None = 0,
        /*! \brief User has clicked the body of the notification. */
        Content,
        /*! \brief User has clicked the action button of the notification. */
        Action,
        /*! \brief User has replied to the notification. */
        Replied,
        /*! \brief User has used an additional action to activate he notification. */
        AdditionalAction
    };
    Q_ENUM(NotificationActivation)

    /*! \brief Describes the available system sounds */
    enum NotificationSound {
        No = 0,
        Default,
        Basso,
        Blow,
        Bottle,
        Frog,
        Funk,
        Glass,
        Here,
        Morse,
        Ping,
        Pop,
        Purr,
        Sosumi,
        Submarine,
        Tink
    };
    Q_ENUM(NotificationSound)

    /*! \cond */
    // Below properties are meant to be read by OS dependent code. They do not need to be public per-se, but having them so avoids needless casting.
    QString Title = QString::fromUtf8("");
    QString Subtitle = QString::fromUtf8("");
    QString Informative = QString::fromUtf8("");
    QString Identifier = QString::fromUtf8("");
    QString ResponsePlaceholder = QString::fromUtf8("");
    QString ActionButtonTitle = QString::fromUtf8("");
    QString OtherButtonTitle = QString::fromUtf8("");
    QList<QString> AdditionalActions = QList<QString>();
    QMap<QString, QString> UserInfo = QMap<QString, QString>();
    QPixmap * Icon = new QPixmap();
    NotificationSound SoundName = Default;
    NotificationActivation ActivationType = None;
    QString AdditionalActivationAction = QString::fromUtf8("");
    QString Response = QString::fromUtf8("");

    // Lookup method for the OS implementation to map to a sound file, used by OS implementation
    QString getSoundName(uint index) const{
        if (index >= Tink + 1){
            index = 0;
        }
        return soundArray[index];
    }

    bool    HasActionButton = false;
    bool    HasReplyButton = false;
    bool    _showAlternate = true;

    /*! \endcond */

signals:
    void updated();
    void iconReady();
    void activated();

private slots:
    void iconDownloaded(QNetworkReply* pReply){
        QByteArray data = pReply->readAll();
        pReply->deleteLater();
        Icon->loadFromData(data);
        emit iconReady();
    }

private:
    QString getResponse() const
    {
        return Response;
    }

    NotificationActivation getActivationType() const
    {
        return ActivationType;

    }

    QString getAdditionalActivationAction() const
    {
        return AdditionalActivationAction;
    }

    QString getIcon() const {
        QByteArray byteArray;
        QBuffer buffer(&byteArray);
        Icon->save(&buffer, "PNG");
        return QString::fromLatin1("data:image/png;base64,") + QString::fromLatin1(byteArray.toBase64());
    }

    void setIcon(const QString url) const {
        netManager->get(QNetworkRequest(url));
        // netManager.get(QNetworkRequest(url));
    }

    QVariant getAdditionalActions() const
    {
        return QVariant(AdditionalActions);
    }

    void setAdditionalActions(const QVariant & list)
    {
        QList<QVariant> object = list.toList();
        AdditionalActions.clear();
        for (int i = 0; i < object.length(); ++i) {
            AdditionalActions << object[i].toString();
        }
    }

    QVariant getUserInfo() const
    {
        QMap<QString, QVariant> list;
        QMap<QString, QString>::const_iterator i = UserInfo.constBegin();
        while (i != UserInfo.constEnd()) {
            list[i.key()] = QVariant(i.value());
            ++i;
        }

        return QVariant(list);
    }

    void setUserInfo(const QVariant & list)
    {
        UserInfo.clear();
        QMap<QString, QVariant> object = list.toMap();
        QMap<QString, QVariant>::const_iterator i = object.constBegin();
        while (i != object.constEnd()) {
            UserInfo[i.key()] = i.value().toString();
            ++i;
        }
    }

    QNetworkAccessManager * netManager;

    const QString soundArray[Tink + 1] = {
        QString::fromLatin1(""),
        QString::fromLatin1("Default"),
        QString::fromLatin1("Basso"),
        QString::fromLatin1("Blow"),
        QString::fromLatin1("Bottle"),
        QString::fromLatin1("Frog"),
        QString::fromLatin1("Funk"),
        QString::fromLatin1("Glass"),
        QString::fromLatin1("Hero"),
        QString::fromLatin1("Morse"),
        QString::fromLatin1("Ping"),
        QString::fromLatin1("Pop"),
        QString::fromLatin1("Purr"),
        QString::fromLatin1("Sosumi"),
        QString::fromLatin1("Submarine"),
        QString::fromLatin1("Tink")
    };
};

}

#endif // DUBONOTIFY_NOTIFICATION_H
