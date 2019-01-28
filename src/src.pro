TEMPLATE = lib
QT = core widgets network

PROJECT_ROOT = $$PWD/..
include($$PROJECT_ROOT/config/qmakeitup.pri)

INCLUDEPATH += $$PWD

SOURCES +=  $$PWD/root.cpp\
            $$PWD/notifier.cpp

HEADERS +=  $$PWD/lib$${TARGET}/global.h \
            $$PWD/lib$${TARGET}/root.h \
            $$PWD/lib$${TARGET}/notifier.h \
            $$PWD/lib$${TARGET}/notification.h \
            $$PWD/osnotifier.h

win32{
}

unix:!mac{
    HEADERS += $$PWD/nux/nuxnotifier.h
    SOURCES += $$PWD/nux/nuxnotifier.cpp

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
