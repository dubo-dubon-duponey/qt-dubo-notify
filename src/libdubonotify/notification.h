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
#include <QMap>
#include <QVariant>

/*! \namespace DuboNotify
\brief The library namespace.
*/
namespace DuboNotify {

/*!
  \brief An object representing a notification.
  All macOS properties are exposed.
  Constants are provided for activation reasons, and system sounds.
  Custom sounds are not supported for now.
  UserInfo support a map of strings (in javascript, an object with string values), and can be used to attach random information.

  In case the user interacts with a notification that was sent before the app launch, only certain values are guaranteed to be there, specifically:
Identifier, Response, ActivationType, AdditionalActivationAction, and UserInfo.

*/
class LIBDUBONOTIFYSHARED_EXPORT Notification : public QObject
{
  Q_OBJECT

public:
    explicit Notification(QObject * parent):QObject(parent){}

    /*! \brief The "title".*/
    Q_PROPERTY(QString  Title               MEMBER Title        NOTIFY titleChanged)
    /*! \brief The "subtitle".*/
    Q_PROPERTY(QString  Subtitle            MEMBER Subtitle     NOTIFY subtitleChanged)
    /*! \brief Some additional informative text.*/
    Q_PROPERTY(QString  Informative         MEMBER Informative  NOTIFY informativeChanged)
    /*! \brief An icon.*/
    Q_PROPERTY(QPixmap  Icon                READ   getIcon WRITE setIcon    NOTIFY iconChanged)
    /*! \brief A unique identifier. Notifications with the same identifier will only be presented one at a time. */
    Q_PROPERTY(QString  Identifier          MEMBER Identifier   NOTIFY identifierChanged)
    /*! \brief If this is a "replyable" notification, the placeholder text in the response text field.*/
    Q_PROPERTY(QString  ResponsePlaceholder MEMBER ResponsePlaceholder  NOTIFY responsePlaceholderChanged)
    /*! \brief If the notification should be "actionable", set this to true. Ignored if the notification is "replyable".*/
    Q_PROPERTY(bool     HasActionButton     MEMBER HasActionButton)
    /*! \brief If the notification should be "replyable", set this to true.*/
    Q_PROPERTY(bool     HasReplyButton      MEMBER HasReplyButton)
    /*! \brief If the notification is "actionable", the title of the action button. */
    Q_PROPERTY(QString  ActionButtonTitle   MEMBER ActionButtonTitle)
    /*! \brief If the notification is "actionable", the title of the "close" button. */
    Q_PROPERTY(QString  OtherButtonTitle    MEMBER OtherButtonTitle)
    /*! \brief A soundname (see sounds). */
    Q_PROPERTY(QString  SoundName           MEMBER SoundName)
    /*! \brief Actionable notifications may present additional sub actions (list of strings), displayed when clicking the main action button. */
    Q_PROPERTY(QVariant AdditionalActions   READ   getAdditionalActions WRITE setAdditionalActions)
    /*! \brief A map of strings usable to attach information to the notification (typically, user information). */
    Q_PROPERTY(QVariant UserInfo            READ   getUserInfo WRITE setUserInfo)

    /*! \brief For actionable notifications with additional actions, whether to force the main action button to display as a dropdown. */
    Q_PROPERTY(bool     _showAlternate      MEMBER _showAlternate)

    /*! \brief If the notification is replyable, will hold the user answer. */
    Q_PROPERTY(QString  Response            MEMBER Response)
    /*! \brief If the notification has been activated, the "type" of activation (see activation consts). */
    Q_PROPERTY(int      ActivationType      MEMBER ActivationType)
    /*! \brief If the notification has been activated through an additional action, this holds "which" action. */
    Q_PROPERTY(QString  AdditionalActivationAction MEMBER AdditionalActivationAction)

    /*! \brief User has clicked the body of the notification. */
    Q_PROPERTY(int      ACTIVATION_CONTENT  READ   ACTIVATION_CONTENT                   CONSTANT)
    /*! \brief User has clicked the action button of the notification. */
    Q_PROPERTY(int      ACTIVATION_ACTION   READ   ACTIVATION_ACTION                    CONSTANT)
    /*! \brief User has replied to the notification. */
    Q_PROPERTY(int      ACTIVATION_REPLIED  READ   ACTIVATION_REPLIED                   CONSTANT)
    /*! \brief User has used an additional action to activate he notification. */
    Q_PROPERTY(int      ACTIVATION_ADDITIONAL_ACTION READ ACTIVATION_ADDITIONAL_ACTION  CONSTANT)

    // SCRIPTABLE
    // Sounds
    Q_PROPERTY(QString  SOUND_NO            READ   SOUND_NO         CONSTANT)
    Q_PROPERTY(QString  SOUND_DEFAULT       READ   SOUND_DEFAULT    CONSTANT)
    Q_PROPERTY(QString  SOUND_BASSO         READ   SOUND_BASSO      CONSTANT)
    Q_PROPERTY(QString  SOUND_BLOW          READ   SOUND_BLOW       CONSTANT)
    Q_PROPERTY(QString  SOUND_BOTTLE        READ   SOUND_BOTTLE     CONSTANT)
    Q_PROPERTY(QString  SOUND_FROG          READ   SOUND_FROG       CONSTANT)
    Q_PROPERTY(QString  SOUND_FUNK          READ   SOUND_FUNK       CONSTANT)
    Q_PROPERTY(QString  SOUND_GLASS         READ   SOUND_GLASS      CONSTANT)
    Q_PROPERTY(QString  SOUND_HERO          READ   SOUND_HERO       CONSTANT)
    Q_PROPERTY(QString  SOUND_MORSE         READ   SOUND_MORSE      CONSTANT)
    Q_PROPERTY(QString  SOUND_PING          READ   SOUND_PING       CONSTANT)
    Q_PROPERTY(QString  SOUND_POP           READ   SOUND_POP        CONSTANT)
    Q_PROPERTY(QString  SOUND_PURR          READ   SOUND_PURR       CONSTANT)
    Q_PROPERTY(QString  SOUND_SOSUMI        READ   SOUND_SOSUMI     CONSTANT)
    Q_PROPERTY(QString  SOUND_SUBMARINE     READ   SOUND_SUBMARINE  CONSTANT)
    Q_PROPERTY(QString  SOUND_TINK          READ   SOUND_TINK       CONSTANT)

    /*! \cond */
    QString Title = "";
    QString Subtitle = "";
    QString Informative = "";
    QPixmap Icon = QPixmap();
    QString Identifier = "";
    QString ResponsePlaceholder = "";
    bool    HasActionButton = false;
    bool    HasReplyButton = false;
    QString ActionButtonTitle = "";
    QString OtherButtonTitle = "";
    QString SoundName = "DEFAULT";
    QList<QString> AdditionalActions = QList<QString>();
    QMap<QString, QString> UserInfo = QMap<QString, QString>();

    bool    _showAlternate = true;

    QString Response = "";
    QString AdditionalActivationAction = "";
    int     ActivationType = 0;

    int ACTIVATION_CONTENT()            const {return 1;}
    int ACTIVATION_ACTION()             const {return 2;}
    int ACTIVATION_REPLIED()            const {return 3;}
    int ACTIVATION_ADDITIONAL_ACTION()  const {return 4;}

    QString SOUND_NO()          const {return QString::fromLatin1("");}
    QString SOUND_DEFAULT()     const {return QString::fromLatin1("Default");}
    QString SOUND_BASSO()       const {return QString::fromLatin1("Basso");}
    QString SOUND_BLOW()        const {return QString::fromLatin1("Blow");}
    QString SOUND_BOTTLE()      const {return QString::fromLatin1("Bottle");}
    QString SOUND_FROG()        const {return QString::fromLatin1("Frog");}
    QString SOUND_FUNK()        const {return QString::fromLatin1("Funk");}
    QString SOUND_GLASS()       const {return QString::fromLatin1("Glass");}
    QString SOUND_HERO()        const {return QString::fromLatin1("Hero");}
    QString SOUND_MORSE()       const {return QString::fromLatin1("Morse");}
    QString SOUND_PING()        const {return QString::fromLatin1("Ping");}
    QString SOUND_POP()         const {return QString::fromLatin1("Pop");}
    QString SOUND_PURR()        const {return QString::fromLatin1("Purr");}
    QString SOUND_SOSUMI()      const {return QString::fromLatin1("Sosumi");}
    QString SOUND_SUBMARINE()   const {return QString::fromLatin1("Submarine");}
    QString SOUND_TINK()        const {return QString::fromLatin1("Tink");}
    /*! \endcond */

signals:
    void titleChanged();
    void subtitleChanged();
    void informativeChanged();
    void iconChanged();
    void identifierChanged();
    void responsePlaceholderChanged();

private:
    QPixmap getIcon() const {
        return Icon;
    }

    void setIcon(QPixmap &pixmap) {
        Icon = pixmap;
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
};

}

#endif // DUBONOTIFY_NOTIFICATION_H
