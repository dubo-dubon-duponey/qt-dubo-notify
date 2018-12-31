#include <QApplication>
#include <QDebug>
#include <QWidget>

#include <libdubonotify/root.h>
#include <libdubonotify/notifier.h>

#include <QtWebEngine>
#include <QWebEngineView>
#include <QWebEnginePage>
#include <QFileInfo>
#include <QDir>
#include <QWebChannel>

QWebChannel * SetupWebView()
{
    QFileInfo jsFileInfo(QDir::currentPath() + "/qwebchannel.js");

    if (!jsFileInfo.exists())
        QFile::copy(":/qtwebchannel/qwebchannel.js", jsFileInfo.absoluteFilePath());

    QtWebEngine::initialize();
    QWebEngineView * view = new QWebEngineView();

    QWebChannel * channel = new QWebChannel(view->page());
    view->page()->setWebChannel(channel);

    view->load(QUrl("qrc:/demo.html"));
    view->show();

    return channel;
}

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

    notif->Title = "Notification title";
    notif->Subtitle = "Notification subtitle";
    notif->Informative = "Notification informative text";
    notif->Identifier = "id1";
    notif->HasReplyButton = false;
    notif->HasActionButton = false;

    // Dispatch it
    notifier->dispatch(notif);

    // Add more stuff
    notif->HasReplyButton = false;
    notif->HasActionButton = true;
    notif->ActionButtonTitle = "An action";
    notif->OtherButtonTitle = "A close button";
    QList<QString> list;
    list << "alpha action" << "beta action" << "delta action";
    notif->setProperty("AdditionalActions", QVariant(list));
    notif->ResponsePlaceholder = "Placeholder";
    notif->SoundName = notif->SOUND_BLOW();
    notif->Icon = QPixmap(":/demo.jpg");
    notif->UserInfo["a ∞"] = "thing";
    notif->UserInfo["another ∞"] = "thing";
    notif->Title = "Another";
    notif->Identifier = "id2";

    // Dispatch it
    notifier->dispatch(notif);

    return app.exec();
}

int mainJavascript(int argc, char *argv[])
{
    // Get your app going
    QApplication app(argc, argv);

    // Display the webview
    QWebChannel * chan = SetupWebView();

    // Instanciate the notifier
    DuboNotify::Notifier * notifier = new DuboNotify::Notifier(chan);

    // Attach objects to the javascript context
    DuboNotify::Root * root = new DuboNotify::Root();
    chan->registerObject("Root", root);
    chan->registerObject("Dubo", notifier);

    return app.exec();
}

int main(int argc, char *argv[]){
    // Delegated to javascript
    // return mainJavascript(argc, argv);
    // Purely c++
    return mainNoJavascript(argc, argv);
}
