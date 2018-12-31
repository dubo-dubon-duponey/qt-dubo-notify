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

#include <Cocoa/Cocoa.h>

#include "helper.h"

CGImageRef toCGImageRef(const QPixmap &pixmap)
{
    QPlatformNativeInterface::NativeResourceForIntegrationFunction func = resolvePlatformFunction("qimagetocgimage");
    if (func) {
        typedef CGImageRef (*QImageToCGImageFunction)(const QImage &image);
        return reinterpret_cast<QImageToCGImageFunction>(func)(pixmap.toImage());
    }

    return NULL;
}

/*
QPixmap fromCGImageRef(CGImageRef image)
{
    QPlatformNativeInterface::NativeResourceForIntegrationFunction func = resolvePlatformFunction("cgimagetoqimage");
    if (func) {
        typedef QImage (*CGImageToQImageFunction)(CGImageRef image);
        return QPixmap::fromImage(reinterpret_cast<CGImageToQImageFunction>(func)(image));
    }

    return QPixmap();
}
*/

NSImage* toNSImage(const QPixmap &pixmap)
{
    if (pixmap.isNull())
        return 0;
    CGImageRef cgimage = toCGImageRef(pixmap);
    NSBitmapImageRep *bitmapRep = [[NSBitmapImageRep alloc] initWithCGImage:cgimage];
    NSImage *image = [[NSImage alloc] init];
    [image addRepresentation:bitmapRep];
    [bitmapRep release];
    CFRelease(cgimage);
    return image;
}

