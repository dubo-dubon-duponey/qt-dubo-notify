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

#include <QApplication>
#include <QDir>
#include <QFileInfo>
#include <QtWebEngine>
#include <QWebChannel>
#include <QWebEngineView>
#include <QWebEnginePage>
#include <QWidget>

#include <libdubonotify/root.h>
#include <libdubonotify/notifier.h>

QWebChannel * SetupWebView()
{
    QFileInfo jsFileInfo(QDir::currentPath() + QString::fromUtf8("/qwebchannel.js"));

    if (!jsFileInfo.exists())
        QFile::copy(QString::fromUtf8(":/qtwebchannel/qwebchannel.js"), jsFileInfo.absoluteFilePath());

    QtWebEngine::initialize();
    QWebEngineView * view = new QWebEngineView();

    QWebChannel * channel = new QWebChannel(view->page());
    view->page()->setWebChannel(channel);

    view->load(QUrl(QString::fromUtf8("qrc:/demo.html")));
    view->show();

    return channel;
}

/*
void OutputLibraryInfo(){
    DuboNotify::Root * root = new DuboNotify::Root();
    qDebug() << root->property("NAME");
    qDebug() << root->property("VENDOR");
    qDebug() << root->property("VERSION");
    qDebug() << root->property("REVISION");
    qDebug() << root->property("CHANGESET");
    qDebug() << root->property("BUILD");
    qDebug() << root->property("LINK");
    qDebug() << root->property("QT");
    qDebug() << root->property("PLUGIN_NAME");
    qDebug() << root->property("PLUGIN_VERSION");
    qDebug() << root->property("PLUGIN_REVISION");
}

int mainNoJavascript(int argc, char *argv[])
{
    // Get your app going
    QApplication app(argc, argv);

    // From QT side
    QWidget * w = new QWidget();
    w->show();

    // Just spit out library info
    OutputLibraryInfo();

    // Instanciate the notifier
    DuboNotify::Notifier * notifier = new DuboNotify::Notifier(w);

    // Create a notification
    DuboNotify::Notification * notif = new DuboNotify::Notification(notifier);

    notif->Title = QString::fromUtf8("Notification title");
    notif->Subtitle = QString::fromUtf8("Notification subtitle");
    notif->Informative = QString::fromUtf8("Notification informative text");
    notif->Identifier = QString::fromUtf8("id1");
    notif->HasReplyButton = false;
    notif->HasActionButton = false;

    // Dispatch it
    notifier->dispatch(notif);

    // Add more stuff
    notif->HasReplyButton = false;
    notif->HasActionButton = true;
    notif->ActionButtonTitle = QString::fromUtf8("An action");
    notif->OtherButtonTitle = QString::fromUtf8("A close button");
    QList<QString> list;
    list << QString::fromUtf8("alpha action") << QString::fromUtf8("beta action") << QString::fromUtf8("delta action");
    notif->setProperty("AdditionalActions", QVariant(list));
    notif->ResponsePlaceholder = QString::fromUtf8("Placeholder");
    notif->SoundName = notif->SOUND_BLOW();
    notif->Icon = new QPixmap(QString::fromUtf8(":/demo.jpg"));
    notif->UserInfo[QString::fromUtf8("a ∞")] = QString::fromUtf8("thing");
    notif->UserInfo[QString::fromUtf8("another ∞")] = QString::fromUtf8("thing");
    notif->Title = QString::fromUtf8("Another");
    notif->Identifier = QString::fromUtf8("id2");

    // Dispatch it
    notifier->dispatch(notif);

    return app.exec();
}
*/

int mainJavascript(int argc, char *argv[])
{
    // Get your app going
    QApplication app(argc, argv);

    // Display the webview
    QWebChannel * chan = SetupWebView();

    // Instanciate the notifier
    DuboNotify::Root * root = new DuboNotify::Root();
    DuboNotify::Notifier * notifier = new DuboNotify::Notifier(chan);
    chan->registerObject(QString::fromUtf8("Root"), root);
    chan->registerObject(QString::fromUtf8("Notifier"), notifier);

    return app.exec();
}

int main(int argc, char *argv[]){
    // Delegated to javascript
    return mainJavascript(argc, argv);
    // Purely c++
    // return mainNoJavascript(argc, argv);
}
