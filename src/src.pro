TEMPLATE = lib
QT = core widgets

PROJECT_ROOT = $$PWD/..
include($$PROJECT_ROOT/config/qmakeitup.pri)

INCLUDEPATH += $$PWD

DEFINES += LIBDUBONOTIFY_LIBRARY
contains(DUBO_LINK_TYPE, static){
    DEFINES += LIBDUBONOTIFY_USE_STATIC
}

copyToDestdir($$PWD/lib$${TARGET}/*.h, $$DESTDIR/../include/lib$${TARGET})
copyToDestdir($$PWD/../res/redist/*, $$DESTDIR/../share/lib$${TARGET})

SOURCES +=  $$PWD/root.cpp\
            $$PWD/notifier.cpp

HEADERS +=  $$PWD/lib$${TARGET}/global.h \
            $$PWD/lib$${TARGET}/root.h \
            $$PWD/lib$${TARGET}/notifier.h \
            $$PWD/lib$${TARGET}/notification.h \
            $$PWD/osnotifier.h

win32{
#    INCLUDEPATH += $$PWD/win
    SOURCES += $$PWD/win/apputils.cpp
}

unix:!mac{
#    INCLUDEPATH += $$PWD/nux
    HEADERS += $$PWD/nux/specialnotifier.h
    SOURCES += $$PWD/nux/specialnotifier.cpp

}
mac{
    # To get NSImage converter
    # QT += macextras
    # Only QT5?
    LIBS += -framework AppKit
    QT += gui-private
#  -framework IOKit
#    LIBS += -framework Carbon

    # Cocoa helper
    HEADERS +=              $$PWD/mac/cocoainit.h \
                            $$PWD/mac/helper.h \
                            $$PWD/mac/macnotifier.h \
                            $$PWD/mac/growlnotifier.h

    OBJECTIVE_SOURCES +=    $$PWD/mac/cocoainit.mm \
                            $$PWD/mac/helper.mm \
                            $$PWD/mac/macnotifier.mm \
                            $$PWD/mac/growlnotifier.mm
}
