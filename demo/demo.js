var libraryInfo = function(e){
    // Display library information
    var infos = e.API.root;
    var iNode = document.getElementById("info");
    var list = ["NAME", "VENDOR", "VERSION", "REVISION", "CHANGESET", "BUILD", "LINK", "QT", "PLUGIN_NAME", "PLUGIN_VERSION", "PLUGIN_REVISION"];

    list.forEach(function(i){
        var line = document.createElement("div");
        line.appendChild(document.createTextNode(i + ": " + infos[i]));
        iNode.appendChild(line)
    });
};

window.addEventListener("roxee", function(e){
    libraryInfo(e);

    // Our main object
    var notifier = e.API.notifier;
    var activatedListener = function(notification){
        console.warn("A notification has been activated: " + notification.Identifier + " " + notification.Title);
        console.warn("User info was: " + JSON.stringify(notification.UserInfo));
        console.warn("Activation type: " + notification.ActivationType);

        console.warn(" - Was it 'content' activation? " + (notification.ActivationType === notification.NotificationActivation.Content));
        console.warn(" - Was it 'action' activation? " + (notification.ActivationType === notification.NotificationActivation.Action));
        console.warn(" - Was it 'replied' activation? " + (notification.ActivationType === notification.NotificationActivation.Replied));
        console.warn(" - Was it 'additional' activation? " + (notification.ActivationType === notification.NotificationActivation.AdditionalAction));
        console.warn("Additional action was: " + (notification.AdditionalActivationAction));
        console.warn("Provided answer is: " + notification.Response);
    };

    // Listener for clicked notifications
    notifier.clicked.connect(function(notification){
        // XXX this is pretty awful. A proper javascript API on top of this is warranted
        if (notification._hack_no_double_connect){
            return;
        }
        notification._hack_no_double_connect = true;

        notification.activated.connect(function(){
            activatedListener(notification);
        });
    });

    // Listener for presented notifications
    notifier.presented.connect(function(notification){
        console.warn("A notification has been presented: " + notification.Identifier + " " + notification.Title);
    });

    var dispatcher = function(i){
        notifier.create(function(n){
            n.Identifier = "numero " + i;
            switch(i){
                case 1:
                    n.Title = "∞ Simple notification with title (blow)";
                    n.Subtitle = "Some subtitle";
                    n.Informative = "Some information";
                    n.Icon = document.getElementById("avatar").src;
                    // n.Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nKy8d7Cl13Ef+Os+54s3vjTvTcAMgEEiCBCBIEVSpECKlEgxieSSkkUqWLIsyyrLdlkq2btea6vW5d2t2pXL63JYWVrZ0tIK1lqMNklRJBhFEiAgAETGzGAGk14ON3zxnO7947vvvftmBiBl7ampNzffe37fr7t/3afPoeHFB+NW7KiuxAns2XPDv/kz/zS2R1M7a3lN8Y1/8Cuvv+nkRhpvIUcYJTXEE4gVAIkHAFFVtUwAIFBViAJQJYPaurzdTlc3Rp3ZpcKb9c3BoUPzvi58PbZUdVthNt52Ugq8h1obugxJ2i7I5QxK0oLCoky89Hvdm/7j737uEx977OIF5DlqQZSESUz/3Xvf8HN//QdjezaNLuZbz5w4MpcNyyKjIFgQMjVD2INqIWFlUqhXVlYKQI5oKM5rEVKx+NADW7/72183pl14rQKpLX3is1/gOHRaFHWWxtHZs2ctpgYzMzMRNX+JCCAAk9uE5j8iEBgkRKSqRATS3dsACARVJVICKdPa5la7v7S2NQrT2TCdG5c2DDrWhFW2tT2s4jDpJm1lLaocsGkQso3E106lcoGrGRq30tk//uinHnv4dDFGKwYUPkOe1UWuf/D7Dwy2nvn7f/eHl+ZnqeqsbWx045ler51lIjCAAoKDg4gUAKCqe7NTbe5BVQmiyrr30O6w0x8BImY2xhhj9sDagw8MZmZlZWmIBWZVhQoaaAhQhRAYBFJVKHnQzKEjw5zj7swzZ1afO33humPXHz2y1IrtTLcXYFwU66vLq0GIKAnj0HoNhzu1Yw7a/TzzZ09fzsv8yNGFU0+uljtpL2mRN6Nhqd5xEJHmw1H5sY9dvveehxff9yonQTvpsIlEASYiEHtiBdSQkhKIQIIDCOzCdxAXhkBUvZClvWH3Xr3LHGr41Xwi7T4yoVODHxkmbegDUogSMYFAAiGwkkKVAChRkLReuLB6+MSdOzv42kOnLi2P/vVvX3rve4698XWvuvmGQxG7KJhNOpidiWpXrK1upIFJ0l671x9m/usPfOH/+neji5dwx+2PLC4eSziZSeMiy8VvEgdBkJCapfn00vmtT3ziibfdfys5nDh6ZHt9qy4Kti2QByuRgHQyFSVgYhs6hdTkhoIVDGr4parYRbB5zQEz3GXTNcaUGcKgwYFISdEwSiaEZ4aqimpjjMJCdvbQdWcvbY/rftC+/olTj6wO8K9/+8J//viFH//AifvfcMv33XfD8PLo3MXVbi86duI4at7aHG2c3e50Dr37h96z2Dv1yU8+9MTjyNcvwhzSINDaMgXGiPc+y7Myr6IIzz2L7W23NNfLcnEeHg0aAvIgAQTgqWkrVPbMk6CGJ+ARKREZEAOsUNE9TIiI9zi2B+fV44orAAg1ADU/CLL7g6DqVX3zGlVVgo3TjZ1s8fDNn/vCQ6deGFTahYUjnLuE3/oP537tf/j8177xaLc7f2jpqHN+eeXS2sblmdn08JE5A0QIbr3+ljtufEU3wnhbB5vD7c2d4XBYVaWqEyoEdV2LtahKXLq81e0vbe3kYdS1UQgmNQL2RJ5IGcpgIkNEQvsOa48iRMQMImIzgeyKZ4mIp+mjqrI7pmFqbjR/GROaNiGvMW8SURXVhl+Qxo0BXnHp8lqru/D4k2cGI3ru+fUHHxrYeFYI3T5mZhHFCKO2q7zULrHBbL8VtuvSb47Hq67eQTUutre2l9d2VtGN2YDqclyUg7LedrLDwShO/dzcHBRBiChsO2etTWunNoiUFazEMvlHREQGRnnaemT3woNYmWCIDcgwG1ImpYNjL+rt43UFTNNITT0iU9/XXAIByf7blVUJsN3+gjGt0ci/+r4f6HSXjh9fuHB20ztUJV55+9Kb3rR48sYT4itf5urqYjywgY6KLTbu0MIse//kI9859dR6zBgPJBvlde2JwAYC8c6J6Gi8lY3R7+L22+8YDIZp0lnb3LJRDEBJABESghCEdZ8ZSlDSq8gFJmKQmTg4MGSaTey9Z2u998YYZnbOhWHYwOe9L8syiqIgCFQ1SRIRabwgiTKUVSzDGLYBA0jTVJnK2tswJhNWTm2QjMe+rji0nfnZo/fe/frh9vjQwsJct/t99924cmn5wx96b7a9GrPrJha+jAJDooExvvIQe/70+b948LyWmO/bMIhm55aUbF5WIHgP9QgZ6vzsLPo9VMVoptcbDoe9Xg/7/ldAfpoEIiLaOLJdSCCAGmIiEKkBTeKgqPqpyz9xey/t1w+6qpcbROSdMhtjgroS56Bixpl0Oouf+NQDzkfbW/lT33mmm7auW5o7cqizeunMO99+z8KM7bVQ5lsEHzKrR12h11pIbX+wMlhfGYXA//G//dPf+s2PHj580iPJCvEI2EbWAAKpwUBgcPkifuM3/k2RDQJrZrq9nc0tItMYVwPZBDtlQ9hz2DRlaABYwQqFgGQ/WEL3QOCrsZjG8lrxUUjBzSUh2WOyE2RlSQiiMFWEQdBqtWeA+Nnnl8e5PXVm5emnTj3z1NPzM+3hzqVWXB6awY/+yPeRrKdxaaiAKwGEnERm5sLZnVZy9MxTK5/9xLPXH731V37lf1bqBdHsMOfCRzBtaMJqA0XEmOngfe+99c0/gAvnsLp8bjzcqqsiSRK6xjB7jpx5guOuLyPTzJKEFI0BEsTgwNwtXmKoKghTUh4ATCMIdmMfKZRUIVAYY6rSB8YSB97VlkPmMMuKL3z50bR38vzFnWeePVXXNeWDNHLD7cGP/fQ9R5b40ouno1mOYnipVJhtGnHUjsOV8+t1YRbmwm9+49nrb3jl//jr//TS+mBzOEYYK2tVjYwhCyQWJ6/H3/nF9yfR9vKlx2+5aTEOZHVlozc7M65yIhIygAMZIgNlIpLG2kBMTEIgmD1mURPDZTJ3hWBPLwGApea9BzmlUFWliXTf93FEBPUNRZUFEGpoqhzHsUoNNq5mVzNE8nJ88dLg3KW8Xl5rt46efnE5TWcGO2v3vOpYPsruv/+WbHw2CgeVr2MTOAk4TKoKmxvrSdhzpfvjP/7O0dkgaeM7Tz5Zhkur2zJyFSXtoi5BPg6Nz2tj8eY3nkzjHabN64/3BlsX0GmNhgMTBhTYPW11JQ8mP7rJcJVIm9RtMkeAFU2iR7uJ0QHpcLW5TZshTWUDE6dIumfVDbzeqTGBeBZBkrStjYeDYnUjK32S+9bpC5smbDmR4ycOX1o+/77339dp1UV1efFIAi5qyR15E6fDvD5y5EgcmlYa/uxfv+/osUPjAibGoNhwQeGDosK4dNth5MNQWHF4ER/+8NtVVqVerYp1y7V35YnjRw7NzbNChXQS9kiFgMnd6TnuOxwF64EH9zDZQ4anmXXFpzSvu5JZ+zdkgqkyQFXlDFvv1TsKolbtsby8du7F5dXNksOZ585ctnGbDCetqNfFm+6/t/bbYVyJjtlUFHItWoshtptbKyKjTtssHel+8Bf+mgOGJRzXJQ+8Lbzdga05qpyrej28+513Qza3t88mqbRamOnHrhwNhzsXL15szGNPzAj2cblCHjWP0JRLb8g1rcImYGHiwxgTbmI60Zz+CD2QNzhlD0BBAiNgGG8j9qiLuqorbK6Xzz1z8cnHlteXy6f+4gXj2OfFTDc48/wLf+Nn3xdwYUMfx/Hy8hooaiWzUltXSpK04k4SdkJna0pk5dyTb3/fjVEPWxmGOZwiiMTGADDOMDODd7/3re1O1O6meTUY5dtbw/UgtWyp0+moGhKDRpBCoLWiAtUKIYURGBGIkqiDCuAZAIyCvZIIAE/wvE9EIrJkAhArGEzERpRUlQwHQeicD6yppRaSJAx85YhDdQIScMmsHqFqIMogX0vWiqIwISCqSlsW8fNPby+fRQeLL1wY3nLbsdW157O1+u7bceP1aRpXrpLx0LfS67RGtmVS7pMPvcq2ZJ1+6qvCdlvdmf6b5+6//Qd+qDaHf+V/+ufffmJQFyAPr+jP4Lrru2GabI0qDmxoyAbsUdX12EhoVOKwvbqxnKYqXDKrMUZ8zSYEiIWNEhQe8CoOzqN26mpBLL5FtjRSk3gLROwbC2ZSgtWmArVLLmDaqPeFu1CTPwON2RppgiCRITAAJtnZ3hju6Fz75lpb8605ZOELT1VjXIzTzuknn7IRpIX3v/t9R5dOjscXDR9xKCHiAYgltazWwZu4lTn14gIkXtKxDxeP37wxil84OxiNMX8kdq4abInUGOVueS07cvi4IvW6DmSGvYER7aok22t1GBzvd6OiWqvcFhNqX7FtUjKFKKkaUq+qBAf1UFWwqKpnUWXvoKpCU1HiZaXDwUFNhYNJDYOYmEkZohaAqnO+3+7NBN1LZ8ef/MM/8lm/2qhedRKXs8iHwcYmbrjhcO1GTz05fOjBTw2Ga8YKwxE8Q3jX3JXrYJY2N4cxY6Y1m490OKC/9Uv/eGbxxF333L/2lW+trdQUUDsxaSCPP579o1/9lzfecB1RTnZoTWmtMDO5BN60ku7CfOu2VyzedNPc4aOzUeCH2+eNsYr6mjnv9MRVVQQiMqk0fVewrviUvbigDGFmNmhUCjXlVJ1pd13u62H5yFef+Npnt6zbaifcNsHifLo8Hh8/Mdfr9djM/qc/+sLyKsJkwlYAxPvXThgmQFmhG8HI5mgHSYL3/Ji9sLly7uIwKy0HqbVcVkMW5zL/7PPu7AsvRAFgIQpRMAvTkBVVsa0Ox697+l3vuukd73jVrbfNebFgo75qlBFUpyVnU8QjbYp3hujK+urLgXVNZhERwEpeySgpKxhNWFatvFaITVdH4dEZZJu2zb3hcCurt9pt2+0Hp888k7Z7q5uI2zCBKZzfc5/CUAUIUBRDzPWIw2h1uRCHTqv76FOX/t9PfOaJp89A0Op3mWS0NfQw/ZkwICrLOowTkBkW2XhUCmCtYUanHW9tjJ89i/rTpyo/+JmFt8StgEwBEexn1ERgggEZYwJjYGBEiEgmuorM9wQWpgTElSAqqxKBgaburiqaF3knWhhs+HMvbKwto9h2RTQKWu2yGHAcXr60vbOFtfUdG8ALO43yuvZNTkFQFTT1TCUwDbOoqkzYbtVlffby4I8//uknn3q2M3coL6s822FxoUUUmDIvNkb6qruOBVFUVKHfHOaaqahYBmSk6C0Fw43t0xfwZ19efed7hjffGhfZltlNevbMgrmplzfSngiGyO9Nlqbo9z0xa1qykgKqvCv2QPDqmbTV7Q02yn//0Qc+9mlgjFtPHHn+3KVqqxxwuLMshZYz/YXC59bwoCgMGTKWGAwmNAoaKgSSNLW+zErn+/0uh+W4qE5fOLVwtL+2eqnb63hX+bI0Hq5AO0R7ERyul8TDKtrJs7ET2AgqqGuUteukYSvUqnrxIpbXNk7ePKeoAUMwRMxklZihJET7WpL2NNju/wd01vc6drW8NwI01UewqirBk6+8ozB54QKCFo7f1H/dW34oStlExlMgGiSmV5aeEBCZbivVurLwVtWoWAELrGcrbD2K0U6nm6i65csrg/F2a8Y6X25srQchWpFYXwaC+Q4vdLjfCmbbIZM4X+T5uKhqYhtGCUcxDJteP6t8WSNNUWRYubw9GuZJ3KEpy9pLremKhE/266DTCFhjjDgHwFpb146IjDFVWalWoaWqqhoR75yLbSrOGSZVUYL6psbDQp4YmZfe/Pzf++9/5k8/dWa8PrNR5b3rF1ZeWHFmfO/ddz308GPsYCPL1lbi4erAVIagYMCq7F02cVyNt9dnZjrLK7WrIOr6vSAf1Zag+bgeoBfjcK+L2rOCVBPbyrLcV6oltdtzo6LSfEzdtq98aNLYsKWxSnHyhjvUZ3mWGWJWhTKxKKCNAvXaLIHWde0dUUDeS1372ITTZZyXNMOrSze7NJVGzHtYTDwNlGGD6Mnnn4/5nvd88EOf+9RTX/nyN17x2lvnb0rve92rO91eZ+bSxctrO2OncGGYKMXOiagRgXrx3osIvNSQdn/2mVObYzPs9wwHYZ7ndV4XI/RThBYtg9kEM2Hbi/O1L0v/wjMrzkbFiHzhHeVJyEVk2yHyuowY5TgvK7zmbhw7MjfTs86NnHMTEgnBXCOOAYyrF8saBf+SVnfNYhY1a48ixKQEYkCV0JQRT956yze/tFwMuYQ7v3bm9W9783s/8sooXjt6nbnp9je024fTdNG7hLgnEkdBH2pFVLzzvva+Vl/WardH8o/+yf/y7AvncifjrCgL9LrpbNcjKy0HHa7n4rmO7ZVcFq7KiiKoe0nQYVPZqHAo1VfiKz8aty1cicUZHJrD3/077+x2i82ts/2+gRcVO6ms7FrZxDftVUPRFJ6v9FEvx6wrcu7dJxygu0nl7kUg2d7YZESdzkIvWdhZ3zpypD8zT2trj911dxyFOwvzZTtN46STZ8KcEBJITTBQBkKCFQkhgYNdOrTgy7LMqiBp1+xBNTRyVWE8tNIIJjVxKMY5ZiE3ros6s5Vzbnzs6Eyt+biqowIgVAVmUrzuPr77rut+4E0nqupFyE6azJela9BRqArpVP3yILn2J/y9gnUVuURoov6aMhbgm9LiyRtuPP9C8fyTTz/4tS+sr8jyysb50+6e998R+O1sI3MjjAuS1FZVu9Nph2F3NMxBzBQxhSBiQCk1wPbWzubauqtgE8s2SloEmLzI+hzBaUBqDak4hSNS8fkN87MaVmmX3v/BN7VnJa83azcOQ9PtpYuL3ZtOLlb1BuuZOBzbbrC+thzYflOAERVwI0z5QIr30uO7+KyryaXkGwEsYCVmUWGQ4sKZMwv9V2h54cufW3MlbrgRl85cTujGTsDeU3+hWzvmoKirajSiqlzuzRwn8sRtIhAsYFUMlA4d6s3022vDbJyPs9LYpG2NabXaxpfkc2M0CAEqiQsTiGgRUAgMZ1r6htfOLSzZso5AkiThaDQS5EbOp0GxsXqp00077a76sFbGRC1CRZQbMXVg6i8FyHc3w+khUCXxpJM6jhCIWYkF3bRVj7I33fd9qz/u/uQPTr3jjde/5R1Loc8w1jIf2U4wGK4H6Yg5bXe1lLBwY0XXaB/UZ3RUY5FAxWxfury2uVrUQODjTouMzbIsYYnZefEcIogq4homg4oHVAapRRqh39mJgoJ1h8mw5+OLsysr6y4ru73WQn9+e3vIFQt1YPx+Mfhq/77vp64hqiyp8J7zVwKIlKc+QXcXi9C0yAixwjftFcLNY5ZAzvkkTGfmWz/xkXfP9L7wqlednFuoFo+GLl8LyYfz7ZQKDlxRj6oq2B7kcScBt4UOG1OBamgCE8HHrV4QpWzHQgYconSVr3PbieuyUkXFqANWaMlaQ0qFr5FGSCOEptJ6y9hxZFPnsb7+YhQxDK+sXJ5fWIyjdpT0xllOxiuU0RQfoOqhvgnpAEB7BbtmmR3YZYUQLMMDyo2ncySeoWQ5UPVNhU9Jmq4YKEMN1Ih3ohVbNmy9QjUSshpwDqNprprP3RroTOna/dVxGUZtCeu1y88uLh0qRnWSLhTjsN8KbbSxNbzIVIgt83I1SvpJqzeqzCjv5JXEEfJatMoiinJfWpvmpVqDsQ1WCkrDcFRUO1sZGwTWhirlUKKgpTxkW9fshYxpJwqAuDM3V4ozMVd+ZCMSgioZJagSK4gJzEqBaVjhreGiytudxJWFDbhyZRCGWZEHUWibNgVWMAyRb3T5PgknQqrxgKywAUFIAMMUqJLz7J0FRYo0G9dVURW5X9kcDDLZGlK3Fxy9YabVSeJeYMJ26YZlHqLqsK0p4CRpa93JS6orIiO1H+2MCWjXHt5DPCz5tB3XVVnVpYIr+LGnncqXwoWjXKxFZTQkdYyqqW4LAQRPAtm1E2VAlBQQAUDCu0lMU5BX9Qo/8Tm7ZnRNqWX3/NPLOK+pe8wcGCGCgUYqoa9MXVqRmNEdbxR5htHAr73Y21gfxPZi0uXXveWmVoezcTjXi31tI9sKqVtUOxoZD5uPtKwhxHk9AJu0MxtFRVkCgLVwzhNRHMfjPDOGRX3l6uF4VLJ1RV2J46s71ZqJXumzr/0UEeFADX2vW28/+8FUlLNXw3S1YthL04lUtVkQJ2qqP8qqRrxRNWHQiXuddmzvujNaXx260lcy/PyfPtibTVYubYXWWM4Hg21f6fomLq4hyzAaIoxgIqxuIEjwyjsP/eqv/poABASWylKHw3FTdmJmz6i8joo8INZaVRExgfeLBNgNcy8V0a6Y5h5OB9auDoI1rQcmzHopjK5a+BHRXFAqWWIhErLMPiDSOG7FcVgX1Wi4GUV5GI1Gg+2La+crHnhNV5c94K87nuxkW3mB7RybA3hBViH3sIoSUCAri/7MbLuFrU2YUMFU1zUbS8bAgJTEa+XVw7OC2ejBXzs9+Zdhlup+8x702syiq3oBMVlkPWhrV6B2QMqTCDuRSuCJGQITGIsa6ofZkNEiE5k4P/mK3snblsQtrW3P1SZbWa0e+MzTSdJ6+4+8I+4MvQ6ybEjGepnZXp/fGhBCsZFVCgzHVVUlSbJc5XCIW5FyoAIR9epgQAQRqIKZLFlxTq/sA9rNXV4arOlniQiK3VXCXRCnQef96b9cbjg9Jm9A0xVgiKBaE4OMGiJgPNdOvM+MBhSMZnpFlmWWgtYh356d/fZDK6dPI03Gh4/Gc0ua14WTfhAsPPro6sXL5weZdZyRgRMuMj31zLmd7TwMUToYE3hlhRBR7RwbZcMgadJSUZJrrXiiIcV3M8SJ3TRy/uDje3hNmycOKPjvyQzZUOqJRATcpIceVDOj9kXtyjSKk3aRdGlndFktJ+3O+vpyErTneuh2sLTYrWitrnd6/YXl5dF//fQDX/6iBBEcY3MHSkhi+AIba1hYjCh34lHWJQAOjPeqDEMEQ+oZZDyhVrlG0PorjAkCL/GhlojgPVtblaW1cVVVzCy1wEBEGGg6l733Hp4QuDIiSg2JelVyTGJNDThobcMI6oJQR8O1TptVvfpRHJjUspZYH2G+N/PMuS0bhSH3P/vJP714RqoxsiEoQgh4QTaE1IhTDIclwLUrwRaAcz4IDLGICJGCICpNddsY472PIqiq955DLqqSw4iZm6U6gPZ6tqVx2NrcbpLcSbnKGBME0FJFxVgjImVZdom8eGpWev6yibQqADtphaRGyXiogACISiN0mJpEQoiAyHA23F7ogy0uXnhxcX5hkOWXL+SPPLhy8RyqHGRaImUN71VLB2vR1L0FrKCmLg/sNsgqQEwKxX6/8TUDuog0DdPT1WGaavSANn//EtS8BlgNQHsbCHZhmgAALkGNWJ1A1iRHXgxIISFgoR6iLKqqARlIOTeLJO3mxU4saCVL/+WTX3/6Kexsg5AAaVmSkpAV0kKbUpIylIkMwI1mJiJRGJBoo5hNU8J8qas7AYtkT0ntvnrynuno+TJj+iv2wZpuHdlry5pmlqqCBFSL2V38OLC41rSBEcNAeFLIUfUqnU4nSYOkE87Mtje2zxLan/rks/kYCsM2LZ3mtZiAQ2tAtZJXgMBgbtJaxqR52AiIYJt2oAnReLeOfmWZZLdMpVfQrpnPnmN6GQ91BV60L0qvWE89+A17r1Z1ajJwDewmDJPBJH7SkyPaWAuo6Tm0NgjjrokSNYmGmnzi419/4hmQoIIFVQWkRB0aIuPLyochJpxS3v1qJYAUe1EcygwDMKvnXadMB8fURA4yi/5bmHVVNNz7RJpeGtp/NYGIeJI47bJtF69mVRJGFaQMVhKoClmmZJS7dqfHkdnY2XbG/OF/OiWE2nNVW46IYxtYw4HUnDlCQMQwqgRqEAE1rouI9/TAxGGDMQ3O1E8lMsbsOvjmou5TaY9Zf3mfdS3viMnGn8l+jN3fQ4CBJpCg+dXNcnLjR3nyiBCDxBNDoRCj2inr2kb9UvJRSZ/9swdOPY8oMsBMpWzJmzAgFkeOTcmxqEKUuSHp7vQat8h7MyRSAcEAfvpnTzuNZtFUm1LMVYvFDWLfI077ZtjcAyZZuu5yVEUFaqaSSSViZdFAYaCYLvc0fV8MJWKIEEHhmp8vomEYCHyWSxQc/b9/aximGA0oThOt88qX5OqiYGgVpHVsEFRqpARAEpNvEynxgKluVs24SUpUVDxUIl+H8LZxTCRKXkmUCGTI2IbuihoQgDwcwJP+qmbnw1770FVrExOYdDK9huMWE8awBXugrmsnPjCTKo2qtrvd0l2KDYsXEINJmFSVd+uzJAAhDKKizCwxseZFbUjD0HrvCNu1y/Jyrde//g8/+u2dDRCDw7CQQa07vVYADoqteunw0s4wSy0WE2ys4OQN4XBHq1EnDE3FGyJoRYBvOgZgQMwk4gPxXUI9LnptiNSIVSypmErAMKRsQIAKicIrea9MGqhTV/qAwaFhJniu69o5Jx7wwgxGYxiiqoZIRUjUkLXTYl/oysr93l2d3BXluhFTSiBVIpCSKrwX79QGHAaJ4QiAuDrLM5gwbrVHebG5M7j82AXnUHnb6nazKmt3kqLMq7JemD+yfnl5/hCVm/r+H3n9t7/yjTTwacjRXCuMQIkJE1/ngGeroSVr2TCI1Buf2Mp7AQMgaYpZSlAiCO8uPnHzy5tmimazH7MBOSg31DEmYFR7UcKAdr2hkjARSVPMAyahUHerGy9nvRDmgqhGA9RkqxwTGSeerTFB7MVkuVOlkNvGdss6HGe+9v3nzqyvbo3CKBnuoNwuozQFOdHaVS6KEiYUhd5wHO956+s3nnx4Y71KSj83u1qUO+XAk0PCIBFIYYDQgAmNkknj2axuNvTtMn0SBB1gJ/uwJrZGUFZVJmbmZkdko+DZmMbHXaGZDsim/Wh4cGuOvvTaEIlRI6RNg5ASqcIBYoOgqnxdF4Dx3juP7dFwbb3ozd9+9txaEC2eOfs4R1x4l7bmhC2YRuOs3U4R55sbq4uLndWNzfe993Xzffiyase47y+rzkMAAB/+SURBVN7r3vmut5moYjvu9Gicr6pnuAWSwHAFrSCl1N3f+TdfKn0AOKX9Ai8zyCvIgQS6CxYYMCqgRkgqiaqoNKGTdneFXQOmXQrtm+H3kqlDQ0hAKgSn6oicwoEc4Gxgsnxc+lESt1vdpHJ+eWX1mdOX//dfemR9HWkMp5jtz6GoyrpWIhVVqQ3CJOLR9rCucPPNePs77u0kvrIAoXdYb3oN15pVpYSp61gHz1oreWOYlLxqhRwcO80msaaRTqpNaG6WHnZlsxLUNgud06s72NUcV8N09bC74O33PO+x7lpgGfJGwUClXIMKhYBISbN8bCziOBKVcT4yJjpy7DCFR//Vvzr26c889+mPP2rD+sLFtXYvLausNzM3HA7bKVfFTmTR72IwwC/+7VsPHw3zlZ2dMaAYlDvU2iJsmDgRW4sZqBDZFgNsSnAOyjgqNaiVxENABDJ7LBISbjJuElYSENQABIiIOOcYHqzEBMUV3TJ7UOxmAVeY4cHXvRTFWNn7gIihQuoVrIYAAtQ7CcPQBkk2rsejMkqiXncpac1Vx246dQqPHLnQ7urqxrYwFXW9s7UcRRQajEewHUQGJ27B2992p+URx0kYA4paokp8DScM5z0ZKCDsSWqrDDVClUVZc1XD+z3BOalwTu/wm7SrKqyCiLyqOOcMecMTdToNlh4c00Q7EA2/+yBRlFAoKmgNdiRe2EMpTbt5VuWZgyat1nwYdFaWR6dPPffII988f94fP7Y0zoOF+aOPPvH4odnOcDS0rFUOVrQshjt4+08cPrbYD9TlYw9BZMFeLbEysTGFUxvEoiq1iAjDChgQ0VrZe8ADwg68183Bu13/ShBPzePctFd7qUlAJHudWg1Yu+jsMmaqBj8Bi5kpCFxdWRt55bIsjTEMVjfpM5lsbG3227PjIFdURKJwIGFSAhPFRaad1pHtrbrMwzCc/4tHzn75K99aXh6r9Is8cq4bcas3u0C3Jd7UZ154djja7sWcVVLs4Kbr8FM/9lOxllwOe4GxJaox5lshslIpay32d86vhTMcJ/Hq2vJ1N7xq48XNTicqvFblKIpQCjzBa03iwjjMsqrdiura0eSUCQVNlguJmNmbMDTEjBrsPKRBxFrrPaIoUmFrEFhqSntEe/2UL9tTOiHTAc/nwKVS0ZRjQSKNeagJbLS6vPPth559/tll0s7GRrWyPDLWOLcqEgSmFoWro05qELibTy4MhnZrdT1iuAo/9uPf7/2oKl2kWtXFuEArQe0F1GmlNNgYH7nuxsFoOcuk1e5vLK+Pc9iQKegtXHccwcOdGfRmwaEIqyp5J0VWmybN2B+Cpt3ge1n5eYlxJVjT0oGmcvnJFxKLkJAl9QJADZQJVmACG1tbpEnS6SaG0narf2RpqduLCnfBGCO+u7ZKa+vDHsU1FUfbnbJWS/3R9nj54uU3vfXmzmxtg5o8j8i/5q3ti+ezMuzvVDPGxJtDGRsD06mdm+kdXd/I+4tHBXL+4nBmUFWKsIMgwdZgheOqE3aSpBVH7bqopmECidC0L/srg6VTamuvjnEgoCoLgt3TNDwmOaMBqCzzdie5+55XvPKVtydxv66pyFwQipPDbIJ81HvowfXlS1tZ7XI/rgSvfs0db3zjG579zulPfeqPP/bJz5+8fmHt8vKLZ5cDCn7ix/7W17/2/OXVjX/+mw9cXn/htjtu6s7SW9/+qt5s71vfWf3cZ77x4rm1NAruvPPOn/7xt/36P7u+zi85szV/Y29j84KIVKX4MouDuJnBpEgJATmoxbUa3P/SYOmUerimNG0MD5IIKWRyPIGqEBGxltVYrLMBhZENgi0rGsZCMKrtgBeM7w2289PPbQ7GEnY6g3Ll1KkHw+Bm9YcuXew89ui5D77/zmJ06LEnNr2pPjxzx3PLl7797XOeyiA9/txlvzk8zfM33Xjjod/6nedWLreVmJTPrfjlC1/51Z9/ZRiMhLKdjSzLR0mr10q7oW3VWUkQ3T9eQKd6Pf4bx+5+nauQ2jutYPopERHofmtkM0hUNQwD0dJrVtabw/GlolxR3XC6WeQbRT303mdZlWdWXO/kza9RdLZH8ugTp6PWYildmx4q/SEb3TYYzxaOh7WbWbie7AL48G23v31na2Hx0Gsf/c6LwyxYXUvj6NYjR+/sdG/Mx0vLy1ZU49QnbfJUBqEREeekyGuo3aUCNycD4P9fM7wCOBGhgyAKKrWlRw3sNqEQNdtpo9A6B0vMDO89GzCocpXXkYnSQLoUZEnHhpS+8c2vO7P68LAarOxc4ESHfpT2WwXUF7BpOn8o1OrS5XPfqUbr15247vvvvff5R89qttq2+fbK84PltV47vv/dr86G5ec+8eKLzz5fFEtVawBbO59bG3lR8Soihi2UGNPtU/JXcO4TsCbCBGhajyZ4qYiyb3ZPTZKDxknBMTzACiGYvS/3vq6qUhjGGF87ZmayZZUFgSPKHbKs2Cl87RHPHuqMi1EYRknYMoyqKFmscrIx3uzNJmsrxeHFrrCzoV1d3zp37gIFYVYWiQmCyh1fOrS9mc0kph77unZx3AIrERoJZjlUiYDAGgsVkJfmdBllELjZ1z3xYgwY2TNSckqik0NQrJBXNOfWqDL2rIjJWPFig6hyPgiCLMtUlRQBG2uMAUG8ulpcTepDNraGra2trfURSaQ+VOXGPOM05ICqqvTes1h4tohiilGTVLbyEneo1K20Des9hpEdtcywbkvQwnxq+0lLsvJSN8VoO0eQVmGnlPZnHvjW0Lpotv22739fVHWr8RB+UJdDQLbKogrCQVFUzrOGIXe1SDWPpGzOdBqL5gIVZRVLQqzCcCKVqlcYSEQaAyFYhbwGAgPiWBE5CWplp07Jqda7Z8bIhFC7BjgJebpfrlU09dymFq4gZaPMakgMi52c8gIGxDnnvTeGoiiy1hoKWAPx5CsVDVrtfllV4/GQIb6WQOP5znwa2DSw452qHMtolNW1r3KwppW3pfP9Q93lzQsmpe3RuBxKJH12YRTESRh5KcM0CDthf65Phqvau0rUc2ijJI4JHlSD3G46zSSm0fS7tsNKAWBUyTf1VXUCeFGFEViQAascDAgHHPz07f00suHpftr1ksM555xjtoYDVfJOVdWJhw0Mh9Yk0KTfWySEzOx8UZTDjc1LzNJut9utuTRamu3ePNudV9cJg04UY5A9+YEPvXo42OjG/ccefXpnuypGaWiWAtsus8z57Z3BhdX1SzvDHbYUp5HXopYxmxpUHQx8Ta5joZb2Triamu9uuoO9LSjXrEDw9HtwMCBOwzT9noMuc99n7n2Cc64sq7quFaasoQiUgrX1QV1yJ5196omnna9E8zAV5XJ7sCJaF+O6HNkL59aLIivrcrzt4OO6HN911y2BKUfDFWtcp5N4j/HQZSNiiubmEjJZZyaNO60obYVxBCOieemG42x7T4sCYG2QMk2dElNLpwcjPhoN8FJg2ekepWmF9ZJ4KR8IKdSc7iDiPBMZMgCcEy+wJmRrkyAp6raNWkSBtRgOs09/+tNhwGGkbMrZ+eTwsZmy4K//+Vdrn7Rb3XF5bmZBO62FfpRkxfDf/ovf6c3NDTfWl1fz266fv/GmQ2de2PnqFx99cfX0Tin9eeXQFjXytRGrBJZbaWAIXmhKIgp0V0NMsutrDKJJ04HK/jYCPbiF7sojoa7g195FaP7uHYuw94V7kdk516z4iygRhWEc2Eg0LKpgdaPY2hl2+61+L1Edn7/wVKcnlV9/9Wtvvu91r5g7FG1snxmMLkDHRPUv//0PKKqVlbNluZHEZWC36/qctRtveP1r5+b7vVmtde3CxXO1K44db9117w2jcR0nRzudE3F6OG31hLSsyzRNJte12S7bHNOjzMp7E5zmwa5tXkG0A44IVyj4vZJpA/E06tPv2T0mZA9vhQpDLUGEnKsDDoMgyseytjkclsF2xioXlo62X/3aowuHjiK449QLj9x7z1sXDgWr26c++OG33XL75ccfu7hyee2H73/Dwlx/lJU/+qH7VtfWBoMXj5+8/cXt4W03vLXeEeq33vJDd84ejk49/cT6YPDKO2/4yZ95V7n9LJl4a32U5/mRIxE02xkO+p0ea9JcRMBPTVMa7tDBzlLa7eu4WoTz1BFjL7c5c5pZ33U0tPLeu1psAILJsuzypex//Y2HbYxxjjRpd6I7/9qH71k6PvP7f/DbX//KIx/4wHuXV1781kOPkiS/8PO/8q1vnv7ql77x1S+sC7wzC0nX/eN/+MOtHo5t4vf+3SfyU3kxcNfdeePb3vG2H/nhH3z8yb/42Bc/+aUvPfBzH/mRwcbqN7/ycBLjZ3/+1XfftZS26sBGvgomsokE2hRLpVmj2OME7QWuq7zY3u0D+6jBLCLNIZJ1XTcHaTUY7R0rqarNLjedbNBVr+LEi6/F1eK8eoGoeA/RVpJ6ReV8nLSGOzH5k5fP3R7xndXwxNrF5DMf+4sYJ4rBjHE3rl2c60SvrwbXuXxxrndLiPls0EF12/bqMa2Pn3t+/JlPftPUSx/76OOXTs0U2zccW3zLqWfq3/sPnycsbq0n+eYxrW7786+tbW7MbmzMra8a4vk8B9u0rEk1UDHivYhrtjoonIgj0ukGoQaXpsmrYRaAIAi890VRUNO6tNcvs2em+5w80D+BKx4HmtXEayzhHrDwZjFR274+kcSveuUr7u/2DktN2SivCt+Ke0Bbtacyo9oRz9477zN4t72T/fA73u/rZHHhxp2NYZXR049uWF284447brn1+ijtlc4sr16sqqrKU/JL587KpUu2yJacHDbcV4pE4R2g4eQoR/I0WRC7RqH9u1rMtI9jXHXCH73sUJocMbBPThVuth1Mgig1J+Z4Ja/GcWii+OY7jkVpxuEm2bXaX+Rg2+u2YKhmrHbk7YrwBeJljpZ9dPbdH/q+pGN3dnbiGFFIo0HRSviGVxTXvzILW7k347XBYxpermUsEq2s6+VlW1SHnJt1GrvmIBkCYHaDoEy5WMFBjA5Y3EuAuOf1+QpV9TJ4YUK3l9tWzZNuO/La4AWyZuzGaYcLtx7GrtsLFHldDwW500LIEVdkcvCYuQgCidvB//lv/8XG1koYebKDixeeuf2WO5577pTn9bA1rlVMEOR+Oe5mIHE+BLqDLADmyzotPWpfgcXavYRX6AChroyGOKABrsRODw6+JrQvPybkmnSaYdKPontH69HeP1H17ErNxVa1FqSUhC0So8LWhERGtVmPUhVSF6nr+Wrh6SeXa61bXf/jH/nBVq8eDIY33XhHVUIRedcn2/VmHKY1M6uEHKR5BQ7aooGSeBTClSe3+2MnK4pQC5jpnTZXU+QKHK5+9krhr7trFHrVwG57EfQl2k7kYD1HSeEdShPWonkY2rL0VQ7xJg5boU0AeO8b9wlPUiZVHimCxaPH2p1eXvhvfePJKg/Kwm9tb4YJCUM08D4Cm1q8VwZCJR5lBduIDJsAbLyiqOrRQQ/FgGGxUHMFRtMMuiZe07Z14FBXXEW8a0J2NUh7rU5TXwNVeHihDLZc3bwMkjIXcRFraij1DmVRZUVV1h5qGC34vvjAm51f/OWPdHvzqxfNxVP9mfS1zml7Bhps537Vo3aOA56pi0RcoEqdXkfJsWUnzlPlKSN2II/9LXF7V9fsdRe9BDTXXmbeBwsTpGhySIPuASZoTsciaTYSy+TYHjbCkzM/yQMeaqEBSUDKrJ6lhJakFbQirQP2UvmV80WVx2qyoDUwwVhcWWWmGkbVSLUCyFMACtkE1lX5+sqlyxeXjx09mY2DzZ2qM5tk5c54YMZbRpxn+CTqqhoAquMjh0wvGUemqKuRqzJ4BIhiTrnpMQCkORyoSUBUeNLEKUK1EATMYo1w41qE1BM8sRCpKkMnh7kToUlXmm4hQmBgxbNM9irWVT0CVSZQDw/LHEbiEZvIZVUn7qkHm1qQG06lSiLqSOa6CepipR2LuiE4d/UosZJq7/N/cl7Gx5y5sHhyZfbo9o0nZ2NZeOrB7ce+9kKo0bGjMwvHwovbp+MupxT/7r/89zGz88MSmzNHje0Wo6J++Gv1H/32Ey3b1XJroZdqXcwfahejc/ff3Zul86a43LFqBZG2u3TMb1uUdRyqM1oQfMDDakimSEM1XslDUDmqHFRA7K3xMN4bghjvmEvhyhuIJzhxfq8U0fQu7Rq2Mu06o4ZwRJNOOWUoG7UsVJgYFamJ+2LmNoadUXE0y094vXFn3B8VCQfzWdkq/Lyaw0UdLl88Y2gwN5MORitv/IF77rjzZJ6N3v+B9153omXMcpSsHzka/tzf+EgY0ZHrexdXn7UYhTRkbKnZevu7X1fK2g++874j1/Wzcc0aRUHx3h/9/sOHu+qGy8tPn7ihdfPNnVZrMBhd4IiT1sL2MNzaSnq9V4xzOyqspyMVHdXoRHfhFaVvD4ae1DJI2InxQhDQpO1NJ42PnuDJNisdrPtSQ1XtNd3QBKgrtQOJqca0hU6wU+WVzq5dTr7ypeVAt4uxLMylcRzcfd98EPOXHjg1yurbbj+eS/WTP3fXeFS8+f5Xfv3rD/TS7nhr7vELw9DqBz58OOkcLv3QROH29vLHP/YZ5+Z++e99KKbNw0vHPveV5zv9qKwvBXGYtvM3vfnkM1/7xpu//80vrA/m5utzLz52193XP38Wcdw6v33mhz709qy445HvPHJuS4JN/2IxsPXghhsOv/jchcLakmLLnATggu65/WYtLzCKKxqyp6Pc3mT3Pdquv97tojmIFPQaAUJVRbVCFUbhuCxqb85clI9/5nyVFWVGUg+OHtMNd+PS0vzv/N6jg1Hwnh89uj2ovv3nn62qzXtf037qmQdXXuA6S9MgEV3tLGz+2j/5SBTP/v4f/pcvffHSzgDz88OttY1/8EsfiJL44Ycf7PY73/zq6b/5t3/6t37zPwcaHQmqV7/m1if/5Iv/8aNfiMOdn/rJD1rT+ovHH3v86ZVf+MWfaZuZb/4/D3/nhdV2WM3TjB9n73rXm/7rn/3ZRhmkvcXhYOyqjaUZ/Po/fN8NSwGhbFKda7OkwUr3Z027ENkrYuee+FTZlxEQ2VWvZEzMbMCeo6DS1tp2KnVvtntssLO6vLV26lx96Nj1HjcnSSeIT7i1Za1uvP7w3Yfn74X7fGLnRqMq7bR3BiMKi699cfXE9bd/88ujQ7O3hCzFKDy9sfWtP3/urrvvtjh89rnBQve67zykfnzTeLx1x+3dND5UZ7M7G4ckTp98xK5d7OfjbtxZCRNb+jJudV0dra+PSx8HPmK+viyWtlbj2h0djFZCK95v2TAC6isYME2LaTO6GsprM+vql04+UUxCfZeLpUqkMub/a+zaeuS4jnPVOd2nrzPTc9nd4d5IigxFyRYjhZKs0LYMRrFlwzBgAwJiBEkAvwR5ylte8xD4z9jwcx5iRXacxE4iG5EA01JILk1yufe5973PpfLQM7uzSwVRPQy6G909fQqn6tSp+qqq6bqh01x5842vfPDT94tqvHc4NdozVcQgLLNyNom1dHZ3x6NJbMjOCntz48U3Xr/1s3/9SZaNNjZvIq3s75fD0fAv/+pvfvPho50H//3Bz/7lT77xbhj2srRRZsk//eOnzd4NYR9IGiVZIhW3eV8w+tUv9zMTeu4Kp0cCnULOfJdca+3S1sqt7e1OqF56ufFO/trPfxGPY6vTaH/1K6+srx62ApuRqdFotMSrZcjR8sxanj1nM+sz6XmdZRnbkc2qmHpeVVUTqIjRsdZifZ25orQdN/SyfrftMkuXla0Hnajcutz6/e5Ra4U3e+7D3+W9dmgHQapSbWUFjO99unvjiy/M4vT2l/7wPz683+iEzd6ks+rsHe1wXK8kY8IZTBKph9X6yGlXdsgUA4VBnBZO5HLhYOpELEqrOD7+n4pFd15a+fa3Lq12R0b8trWmDw4mH/564DD68utvvnQ96gQzI6u5gQSnooO45E2uofanWmx5q/d/+rMuQFHnrT7AYpWjU+aFdoGSQwmUpekhssJQgaCrIgXSqA0orauYaPb0YN8NjWHl/tETwqsn49FPf/5+oQvuwsaVjWlyfHD8RGmapgM/DO7dO+h0072TJ71LndGAeUFHams8yza2O3F1X+IkqaYaOfLQIEurQqXTHjq8spue2e6vzgbW/XsPfhTfH4/v/e3f3WhHG4Gn0KRVlgk2DT2ZpXuuzWHJwfm8sY14Uapw0QSGAYAQQmvNGCOi2olT70Lqsll1CS0AqO/Rao7vUkoZYzjnRJQkCSLOZrEQTpYWwvFKqY0BxtDxFAo5Tma2FzJhMwfjfERcvvHWm61ud5bHIhCK5f3t3jSJLeGCjYQqyZNGM8oyza3Q8xtHgxPhcuJKkiZuTRMpvKbXahEazm0Gdh7n07HiZvPgsfufvxjt7kCZbmRxr0w7oCPb8slIzgshyuVqkqetYCxrnsNkzLw+1QUsYH39rLvMBXlcluezA1DaLshRcZkXxlLoGAya0ZbrrxXSQu4VEg3ySZLZXiOtRFoAcE1QXFpdI4OVztNssr69Jnz73371X/uHR67raqoIYDYZ2rbdbEZVUXqep6pqcHJSFMXx8bHneb1elxgZ0HVinOu6mkySzNzAVahzVaBgYME0q4A3g+ZWKRGtFWUacY6KnFJRqSgtikqpCyP6TPfUBVV1StYpawDO7YyWyRhj0BhjJCvRj40vZyUpEZXUGiee53SePpGO1+ccwYo19zJpuu2uxC5ZTFZHSs9kobMki1r9dhi88sXrg9HHkxlkswrJlEUWNd00TnRRTIeDK5tBy2+CITBya2trPC3iKp+lhy/0QViOVhUZJRzwXf/R8X6whpyzkuWJiadm5ETrd+/e+d67b/nBU6/9iSIrQ1lapA2AF6HjCpvpZIxzPOC5AS52fYtUqUUS2TlmzbXdHLCMp88vK7mz6YZqVp0w3zGV4/htz/c5R6P0o52HxwePXXdo2yFgGXZgHO892JkmyaFNtLV5CVVFZQWVyqbVwZPp0bOJ14IsGTJIHQYN0Xn2cGAKEzlhFQ+zcR45oa3clse70aWPH+/2Ox2s9kK7oQsFldQYv/bqzWfDT1WRlmbiNZiwUIGS5dEnOx/7H8wsvv/W19yg2TaEti+4FrbjplkaZ5PVJgdS8PmoNqFg2YKnM7k7E0C8mGpQM84gJ0Qi4lWWVfmE036ZqIef7F5ejxCzq+tt1zp5+UXr44+eFnkIsrSUeuMLf2SrvOM6z56aqqDdvFwPbrrtSWhPe5vh9kq4cy/78eP3Byfptcvhe998j+eoJkUZkwijO7fv/Pb+p5DlvnEdKVzNQoZMxrdfufbRJ81ZchTHEmjMqAg94K61+/Th0YMdl03v3v0LgYHF7CKZcD5lVLTCkNlNhHSxlzvjyOnZqTxeUE10apTSmXfinHV6nk01MYc5UqJr7KyMu83y7T9uYdnJE9LVoNOmL7/WefWmp753veGNnjw7GQ/i77777ttffdEyz65eliwfZVPI4sN2T979+is3XvAajfCdt284cjg4POleE6/fbt6+FabxvbXVWeBZq11x9eqs291HNmw30+Hxr9utk/6qIpl0u082N0f7e4N2B3QyHB0eogTHPohTRbkdtojJkyo9CcRh4Oy5LqSj+zptWpgj/4yEfURcHv4FOptZ/6/Omgd1yDAiprgpbC110/ddXnVu6mv9L4Tiukyx03CNGRk4ZMlvrqzRD/78ei5fjhodkxXd3q6EJ3/2/V7g9z3Rl0XTcZzx7KEXzHy3+NN3Vl6+HiL4rsP6a7Yu//nyRvcffngnSVHlg62rj/9+49bKiq1nv7x+7dEP/vrSeEKmmrz+pT3RbyejV60J3trevnJl9epGo93upJOkxUIOk6jxURAF339v5Tvf7jd86/Ja2HXSIptp4Aat53XWMrMuAPme01lY+4U5gCHQ818iqpM3tEEEYwwjFtgRlYmHGMcntl9EgSVgN4V8Npbdrj8eP7Zdu+W5l/7gxYe/3xd2JlyeZwPbm6ytSW7tJvFDbvXSlLcDfzqZ6JRFjYj3q2bDIZ1U1dj342I6bdhSBCxsG6Pu39xujKePN/ticPi7yxu3em0AktPpv6+tss2VqJF2y2zX9tmNbdcWSeEk6+1gdDwMG5mBeLXtsZVGFPrJeK/QxDgoIoNk9Ny/hYaMMYzIzDtika47LBlAojm8eUkMgXEmlQIwjHNtpCyLQIRIqizTVtthQFVeOD6SNgRYVLkleFpOglAQIGmSeiJ8BkonxUQEIQBYnB0d7YQuNyCJwPEMgUWlo0rlQgBEro0OsOE4lxpGD4aB11R2Enru/rNj37eA0PeyvKgqjpzzkmYM1fGJ0eTEw93VzfWslF4oSBcAYxKVEDZgXYLduA0sq8OgJbT2jKaG62qiKp+5rpBEiKQQ9WI3wwjmXilieVlVBgxSrjVJZRjNk7mIag7qRbCoXunMWcEGNECMgSEitsCNYD11gcyieRMaBAJARVTnaC5QdVTHVEoOzMx9jIyAo6lbbBhujDEVU4aTi5yFzDVK2dpqOu1klDDGMMuVUhqYZVmalAbttxqGKs7IMoYDMiQOBpkkjAk4q/vpAAIBgQUIRKLGm3HQQAg1j3AR3UEGpMHgcijBINSFH83cuPjcpTeJLkKVzyMhzOJkfjz/iFp7LtYQgHllGHzuPcYYKSWgbVmWbdtxkuXIGGNRFAnhggbGmNYkhKXqwLculFGgFmYN8Lpuf/09dVCd5gVB5us5nF/OcIEvW9ZEzw/zAhOWXQqft3DP8vO0WDzZebdXrf0A4PTCaUB8+V/rRxiiUkrKzHN8znlZlmVeGGPSWRoEjSzOgiCoKiWEMKALWbY6odSSMTTGzPt8GZgH1IEA5oYlACxKtZ5LGDxnHOBFfl0YxfP31PS/xDjGWIR8DK8AAAAASUVORK5CYII=";
                    n.Sound = n.NotificationSound.Blow;
                    n.UserInfo = {
                        "id": "my_id for ∞",
                        "nickname for ∞": "my_nick"
                    };
                    n.iconReady.connect(function(){
                        notifier.dispatch(n);
                    });
                break;
                case 2:
                    n.Title = "With reply button (no sound)";
                    n.HasReplyButton = true;
                    n.ResponsePlaceholder = "type here";
                    n.Sound = n.NotificationSound.No;

                    notifier.dispatch(n);
                break;
                case 3:
                    n.Title = "With action button (default)";
                    n.HasActionButton = true;
                    n.ActionButtonTitle = "Some action";
                    n.OtherButtonTitle = "Foo this";
                    n.Sound = n.NotificationSound.Default;

                    notifier.dispatch(n);
                break;
                case 4:
                    n.Title = "With multi-action";
                    n.HasActionButton = true;
                    n.ActionButtonTitle = "Main action";
                    n.OtherButtonTitle = "Bar this";
                    n.AdditionalActions = ["action 1", "action 2", "action 3"];
                    n.Sound = 50;

                    notifier.dispatch(n);
                break;
            }

        });

    };

    var dispatch;
    for (var i = 1; i < 5; i++){
        dispatch = document.getElementById("dispatch" + i);
        dispatch.removeAttribute("disabled");
        dispatch.onclick = dispatcher.bind(this, i);
    }

    var remover = function(i){
        notifier.remove("numero " + i);
    };

    var removeall = function(){
        notifier.removeAll();
    };

    var rem;
    for (i = 1; i < 5; i++){
        rem = document.getElementById("remove" + i);
        rem.removeAttribute("disabled");
        rem.onclick = remover.bind(this, i);
    }
    rem = document.getElementById("removeall");
    rem.removeAttribute("disabled");
    rem.onclick = removeall;
});

window.addEventListener("load", function(){
    return new QWebChannel(qt.webChannelTransport, function(channel){
        var e = new Event("roxee");
        window.Dubo = window.Dubo || {};
        e.API = window.Dubo["notify"] = {
            root: channel.objects.Root,
            notifier: channel.objects.Notifier,
        };
        window.dispatchEvent(e);
    });
});

