import type { Metadata } from "next";
import { DEFAULT_LOCALE, INTERNAL_TO_URL, STORAGE_KEY, SUPPORTED_LANGS } from "@/lib/locales";

export const metadata: Metadata = {
  alternates: {
    canonical: `/${DEFAULT_LOCALE}/`,
  },
};

const FALLBACK = JSON.stringify(DEFAULT_LOCALE);
const REDIRECT_SCRIPT = `
(function(){
  var SK=${JSON.stringify(STORAGE_KEY)};
  var MAP=${JSON.stringify(INTERNAL_TO_URL)};
  var SUPPORTED=${JSON.stringify(SUPPORTED_LANGS)};
  var FB=${FALLBACK};
  var stored;
  try{stored=localStorage.getItem(SK);}catch(e){}
  if(stored&&SUPPORTED.indexOf(stored)!==-1){
    location.replace("/"+(MAP[stored]||FB)+"/");
    return;
  }
  var langs=navigator.languages||[navigator.language];
  for(var i=0;i<langs.length;i++){
    var l=langs[i],p=l.split("-")[0];
    if(SUPPORTED.indexOf(l)!==-1){location.replace("/"+(MAP[l]||FB)+"/");return;}
    if(SUPPORTED.indexOf(p)!==-1){location.replace("/"+(MAP[p]||FB)+"/");return;}
  }
  location.replace("/"+FB+"/");
})();
`;

const RootPage = () => {
  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${DEFAULT_LOCALE}/`} />
      </noscript>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
    </>
  );
};

export default RootPage;
