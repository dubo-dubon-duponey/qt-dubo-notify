TEMPLATE = lib
QT = core widgets network

PROJECT_ROOT = $$PWD/..
include($$PROJECT_ROOT/config/qmakeitup.pri)

INCLUDEPATH += $$PWD

HEADERS +=  $$PWD/lib$${TARGET}/global.h \
            $$PWD/lib$${TARGET}/root.h \
            $$PWD/lib$${TARGET}/notifier.h \
            $$PWD/lib$${TARGET}/notification.h \
            $$PWD/osnotifier.h

SOURCES +=  $$PWD/root.cpp\
            $$PWD/notifier.cpp

unix:!mac{
    HEADERS += $$PWD/nux/nuxnotifier.h
    SOURCES += $$PWD/nux/nuxnotifier.cpp
    QT += dbus
    # Not really awesome...
    CONFIG += link_pkgconfig
    PKGCONFIG += libnotify

    # XXX Runtime depends on sudo apt-get install libqt5webenginewidgets5
    # build time: libglib2.0-dev libnotify-dev
}

mac{
    LIBS += -framework AppKit
    QT += gui-private

    # Cocoa helper
    HEADERS +=              $$PWD/mac/cocoainit.h \
                            $$PWD/mac/helper.h \
                            $$PWD/mac/macnotifier.h

    OBJECTIVE_SOURCES +=    $$PWD/mac/cocoainit.mm \
                            $$PWD/mac/helper.mm \
                            $$PWD/mac/macnotifier.mm
}
