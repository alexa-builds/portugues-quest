export type PersonKey='eu'|'tu'|'ele/ela/você'|'nós'|'vocês/eles/elas';
export type ConjugationTense='Presente'|'Pretérito Perfeito'|'Pretérito Imperfeito'|'Presente do Conjuntivo'|'Imperfeito do Conjuntivo'|'Futuro do Conjuntivo'|'Infinitivo Pessoal';
export const checkedConjugations:Record<string,Partial<Record<ConjugationTense,Record<PersonKey,string>>>>={
estar:{
'Presente':{'eu':'estou','tu':'estás','ele/ela/você':'está','nós':'estamos','vocês/eles/elas':'estão'},
'Pretérito Perfeito':{'eu':'estive','tu':'estiveste','ele/ela/você':'esteve','nós':'estivemos','vocês/eles/elas':'estiveram'},
'Pretérito Imperfeito':{'eu':'estava','tu':'estavas','ele/ela/você':'estava','nós':'estávamos','vocês/eles/elas':'estavam'},
'Presente do Conjuntivo':{'eu':'esteja','tu':'estejas','ele/ela/você':'esteja','nós':'estejamos','vocês/eles/elas':'estejam'},
'Imperfeito do Conjuntivo':{'eu':'estivesse','tu':'estivesses','ele/ela/você':'estivesse','nós':'estivéssemos','vocês/eles/elas':'estivessem'},
'Futuro do Conjuntivo':{'eu':'estiver','tu':'estiveres','ele/ela/você':'estiver','nós':'estivermos','vocês/eles/elas':'estiverem'},
'Infinitivo Pessoal':{'eu':'estar','tu':'estares','ele/ela/você':'estar','nós':'estarmos','vocês/eles/elas':'estarem'}},
ser:{
'Presente':{'eu':'sou','tu':'és','ele/ela/você':'é','nós':'somos','vocês/eles/elas':'são'},
'Pretérito Perfeito':{'eu':'fui','tu':'foste','ele/ela/você':'foi','nós':'fomos','vocês/eles/elas':'foram'},
'Pretérito Imperfeito':{'eu':'era','tu':'eras','ele/ela/você':'era','nós':'éramos','vocês/eles/elas':'eram'},
'Presente do Conjuntivo':{'eu':'seja','tu':'sejas','ele/ela/você':'seja','nós':'sejamos','vocês/eles/elas':'sejam'},
'Imperfeito do Conjuntivo':{'eu':'fosse','tu':'fosses','ele/ela/você':'fosse','nós':'fôssemos','vocês/eles/elas':'fossem'},
'Futuro do Conjuntivo':{'eu':'for','tu':'fores','ele/ela/você':'for','nós':'formos','vocês/eles/elas':'forem'},
'Infinitivo Pessoal':{'eu':'ser','tu':'seres','ele/ela/você':'ser','nós':'sermos','vocês/eles/elas':'serem'}},
ter:{
'Presente':{'eu':'tenho','tu':'tens','ele/ela/você':'tem','nós':'temos','vocês/eles/elas':'têm'},
'Pretérito Perfeito':{'eu':'tive','tu':'tiveste','ele/ela/você':'teve','nós':'tivemos','vocês/eles/elas':'tiveram'},
'Pretérito Imperfeito':{'eu':'tinha','tu':'tinhas','ele/ela/você':'tinha','nós':'tínhamos','vocês/eles/elas':'tinham'},
'Presente do Conjuntivo':{'eu':'tenha','tu':'tenhas','ele/ela/você':'tenha','nós':'tenhamos','vocês/eles/elas':'tenham'},
'Imperfeito do Conjuntivo':{'eu':'tivesse','tu':'tivesses','ele/ela/você':'tivesse','nós':'tivéssemos','vocês/eles/elas':'tivessem'},
'Futuro do Conjuntivo':{'eu':'tiver','tu':'tiveres','ele/ela/você':'tiver','nós':'tivermos','vocês/eles/elas':'tiverem'},
'Infinitivo Pessoal':{'eu':'ter','tu':'teres','ele/ela/você':'ter','nós':'termos','vocês/eles/elas':'terem'}},
ir:{
'Presente':{'eu':'vou','tu':'vais','ele/ela/você':'vai','nós':'vamos','vocês/eles/elas':'vão'},
'Pretérito Perfeito':{'eu':'fui','tu':'foste','ele/ela/você':'foi','nós':'fomos','vocês/eles/elas':'foram'},
'Pretérito Imperfeito':{'eu':'ia','tu':'ias','ele/ela/você':'ia','nós':'íamos','vocês/eles/elas':'iam'},
'Presente do Conjuntivo':{'eu':'vá','tu':'vás','ele/ela/você':'vá','nós':'vamos','vocês/eles/elas':'vão'},
'Imperfeito do Conjuntivo':{'eu':'fosse','tu':'fosses','ele/ela/você':'fosse','nós':'fôssemos','vocês/eles/elas':'fossem'},
'Futuro do Conjuntivo':{'eu':'for','tu':'fores','ele/ela/você':'for','nós':'formos','vocês/eles/elas':'forem'},
'Infinitivo Pessoal':{'eu':'ir','tu':'ires','ele/ela/você':'ir','nós':'irmos','vocês/eles/elas':'irem'}},
fazer:{
'Presente':{'eu':'faço','tu':'fazes','ele/ela/você':'faz','nós':'fazemos','vocês/eles/elas':'fazem'},
'Pretérito Perfeito':{'eu':'fiz','tu':'fizeste','ele/ela/você':'fez','nós':'fizemos','vocês/eles/elas':'fizeram'},
'Pretérito Imperfeito':{'eu':'fazia','tu':'fazias','ele/ela/você':'fazia','nós':'fazíamos','vocês/eles/elas':'faziam'},
'Presente do Conjuntivo':{'eu':'faça','tu':'faças','ele/ela/você':'faça','nós':'façamos','vocês/eles/elas':'façam'},
'Imperfeito do Conjuntivo':{'eu':'fizesse','tu':'fizesses','ele/ela/você':'fizesse','nós':'fizéssemos','vocês/eles/elas':'fizessem'},
'Futuro do Conjuntivo':{'eu':'fizer','tu':'fizeres','ele/ela/você':'fizer','nós':'fizermos','vocês/eles/elas':'fizerem'},
'Infinitivo Pessoal':{'eu':'fazer','tu':'fazeres','ele/ela/você':'fazer','nós':'fazermos','vocês/eles/elas':'fazerem'}}
};
export function getConjugationTable(verb:string,tense:ConjugationTense){return checkedConjugations[verb.toLowerCase()]?.[tense]||null}
