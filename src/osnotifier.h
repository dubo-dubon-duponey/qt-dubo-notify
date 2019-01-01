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

#ifndef DUBONOTIFY_BASENOTIFIER_H
#define DUBONOTIFY_BASENOTIFIER_H

#include "libdubonotify/global.h"
#include "libdubonotify/notification.h"
#include "libdubonotify/notifier.h"
#include <QObject>
#include <QDebug>
#include <QIcon>

namespace DuboNotify {

/*
 * @brief OSNotifier is the base interface that has to be implemented for any given operating system.
 * It's never consumed directly, and neither are the implementations;
 */
class LIBDUBONOTIFYSHARED_EXPORT OSNotifier : public QObject
{
  Q_OBJECT

public:
  OSNotifier(Notifier * parent = nullptr): QObject(parent)
  {
  }

  virtual bool dispatch(Notification */*notification*/)
  {
      return false;
  }

  virtual bool remove(const QString &/*identifier*/)
  {
      return false;

  }

  static bool test()
  {
      return false;
  }

  virtual void clean()
  {
  }

//signals:
//    void activated(int notifyId, QString profile);

};

}

#endif // DUBONOTIFY_BASENOTIFIER_H
