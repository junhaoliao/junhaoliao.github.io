import Script from "next/script";
import { I18N_TO_URL, STORAGE_KEY } from "@/lib/locales";
import { SUPPORTED_LANGS } from "@/i18n/config";

const REDIRECT_SCRIPT = `
(function(){
  var SK=${JSON.stringify(STORAGE_KEY)};
  var MAP=${JSON.stringify(I18N_TO_URL)};
  var SUPPORTED=${JSON.stringify(SUPPORTED_LANGS)};
  var stored=localStorage.getItem(SK);
  if(stored&&SUPPORTED.indexOf(stored)!==-1){
    location.replace("/"+(MAP[stored]||"en")+"/");
    return;
  }
  var langs=navigator.languages||[navigator.language];
  for(var i=0;i<langs.length;i++){
    var l=langs[i],p=l.split("-")[0];
    if(SUPPORTED.indexOf(l)!==-1){location.replace("/"+(MAP[l]||"en")+"/");return;}
    if(SUPPORTED.indexOf(p)!==-1){location.replace("/"+(MAP[p]||"en")+"/");return;}
  }
  location.replace("/en/");
})();
`;

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <Script id="locale-redirect" strategy="beforeInteractive">
        {REDIRECT_SCRIPT}
      </Script>
    </>
  );
}
