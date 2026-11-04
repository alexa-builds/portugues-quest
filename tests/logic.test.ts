import {describe,it,expect} from 'vitest';
import {exercises} from '../src/exercises';
import {conversations,repairTasks,tenseTasks,translationTasks} from '../src/gameData';
import {checkedConjugations} from '../src/conjugations';
import {awardXp,bossWon,gradeAnswer,isDue,migrateProgress,normalizeAnswer,regionUnlocked,scheduleReview,scoreDiagnostic,sessionDurationSeconds,speedDurationSeconds,updateMastery,validBackup,validateExerciseBank} from '../src/logic';

describe('Accent-sensitive answer checking',()=>{
 it('accepts capitalization, repeated spaces, and trailing punctuation',()=>expect(gradeAnswer('  VOU   falar?! ','vou falar')).toBe('correct'));
 it('requires Portuguese diacritics and gives a near-correct result when only marks differ',()=>{expect(gradeAnswer('sao','são')).toBe('almost');expect(gradeAnswer('esta','está')).toBe('almost');expect(gradeAnswer('tem','têm')).toBe('almost')});
 it('does not accept a different conjugation as an accent typo',()=>{expect(gradeAnswer('sou','somos')).toBe('incorrect');expect(gradeAnswer('podia','podias')).toBe('incorrect')});
 it('accepts curated alternatives exactly after harmless normalization',()=>expect(gradeAnswer(' PODERIAS! ',['Podias','Poderias'])).toBe('correct'));
 it('keeps punctuation handling at the edge of a complete sentence',()=>{expect(normalizeAnswer('  Não   fui.  ')).toBe('não fui');expect(gradeAnswer('não fui','Não fui.')).toBe('correct')});
});
describe('SM-2 review scheduling',()=>{
 it('uses the introductory 1-day and 6-day intervals then grows with ease',()=>{const now=new Date('2026-11-04T12:00:00.000Z');const first=scheduleReview(undefined,'correct',now);expect(first.intervalDays).toBe(1);expect(isDue(first,new Date('2026-11-05T12:00:00.000Z'))).toBe(true);const second=scheduleReview(first,'correct',now);expect(second.intervalDays).toBe(6);const third=scheduleReview(second,'correct',now);expect(third.intervalDays).toBeGreaterThan(6)});
 it('schedules a wrong answer soon, and repeated lapses sooner still',()=>{const now=new Date('2026-11-04T12:00:00Z');const first=scheduleReview(undefined,'incorrect',now);const second=scheduleReview(first,'incorrect',now);const third=scheduleReview(second,'incorrect',now);expect(Date.parse(first.dueAt)-now.getTime()).toBe(60*60_000);expect(Date.parse(second.dueAt)-now.getTime()).toBe(10*60_000);expect(Date.parse(third.dueAt)-now.getTime()).toBe(3*60_000)});
 it('treats almost-correct as a partial success without adding a correct tally',()=>{const card=scheduleReview(undefined,'almost',new Date('2026-11-04T12:00:00Z'));expect(card.repetitions).toBe(1);expect(card.correct).toBe(0);expect(card.lastGrade).toBe('almost')});
});
describe('progress, diagnosis and migration',()=>{
 it('scores diagnostic concepts and reports strongest and weakest areas',()=>{const report=scoreDiagnostic([{concept:'Presente',grade:'correct'},{concept:'Presente',grade:'correct'},{concept:'Passado',grade:'incorrect'}]);expect(report.strongest[0]).toBe('Presente');expect(report.weakest[0]).toBe('Passado')});
 it('bounds mastery and distinguishes XP outcomes',()=>{expect(updateMastery(2,'correct')).toBe(3);expect(updateMastery(2,'almost')).toBe(2);expect(updateMastery(0,'incorrect')).toBe(0);expect(awardXp('correct',true)).toBe(14);expect(awardXp('almost')).toBe(5);expect(awardXp('incorrect')).toBe(2)});
 it('migrates the previous local save without discarding its XP or mastery',()=>{const result=migrateProgress({xp:450,mastery:{ser:3},due:{ser1:'2026-11-05'},bookmarks:['ser']});expect(result.xp).toBe(450);expect(result.mastery).toEqual({ser:3});expect(result.schemaVersion).toBe(2);expect((result.reviews as Record<string,{dueAt:string}>).ser1.dueAt).toContain('2026-11-05')});
 it('validates legacy and current backups and rejects malformed progress',()=>{expect(validBackup({app:'portugues-quest',version:1,progress:{xp:10,mastery:{}}})).toBe(true);expect(validBackup({app:'portugues-quest',version:2,progress:{xp:10,mastery:{},reviews:{}}})).toBe(true);expect(validBackup({app:'portugues-quest',version:2,progress:{xp:Infinity,mastery:{}}})).toBe(false);expect(validBackup({app:'other',version:2,progress:{xp:10,mastery:{}}})).toBe(false)});
 it('uses actual configured durations and keeps diagnostic sessions untimed',()=>{expect(sessionDurationSeconds(5)).toBe(300);expect(sessionDurationSeconds(10)).toBe(600);expect(sessionDurationSeconds(0)).toBe(0);expect(speedDurationSeconds(30)).toBe(30);expect(speedDurationSeconds(60)).toBe(60);expect(speedDurationSeconds(45)).toBe(0)});
 it('unlocks map chapters by mastery and awards a boss only at the stated threshold',()=>{expect(regionUnlocked('lisboa',0)).toBe(true);expect(regionUnlocked('sintra',2)).toBe(false);expect(regionUnlocked('sintra',3)).toBe(true);expect(bossWon(4,100)).toBe(false);expect(bossWon(5,79)).toBe(false);expect(bossWon(5,80)).toBe(true)});
});
describe('verified Portuguese content',()=>{
 const records=[
  ...exercises.map(x=>({id:x.id,mode:'gap',prompt:x.prompt,answer:x.answer,explanation:x.explanation,accepted:x.accepted})),
  ...tenseTasks.map(x=>({id:x.id,mode:x.mode,prompt:x.prompt,answer:x.answer,explanation:x.explanation})),
  ...translationTasks.map(x=>({id:x.id,mode:x.mode,prompt:x.polish,answer:x.answer,explanation:x.explanation,accepted:x.accepted})),
  ...repairTasks.map(x=>({id:x.id,mode:x.mode,prompt:x.sentence,answer:x.isCorrect?x.sentence:x.correction,explanation:x.explanation,accepted:x.accepted})),
  ...conversations.flatMap(c=>c.turns.map((t,i)=>({id:c.id+'-'+i,mode:'conversation',prompt:t.prompt,answer:t.options.find(o=>o.correct)?.text,explanation:t.options.find(o=>o.correct)?.feedback})))
 ];
 it('has unique IDs and no blank prompts, answers, explanations or accepted variants',()=>expect(validateExerciseBank(records)).toEqual([]));
 it('has 148 distinct content decisions, with real sentence translations and correction examples',()=>{expect(records.length).toBe(148);expect(new Set(records.map(x=>x.id)).size).toBe(148);expect(translationTasks.every(x=>x.answer.includes(' '))).toBe(true);expect(repairTasks.some(x=>x.isCorrect)).toBe(true);expect(repairTasks.some(x=>!x.isCorrect)).toBe(true)});
 it('contains multi-turn dialogues with three or more choice turns each and valid recovery branches',()=>{expect(conversations.length).toBe(6);expect(conversations.every(c=>c.turns.length>=3&&c.turns.every(t=>t.options.filter(o=>o.correct).length===1&&t.options.every(o=>o.nextTurn===undefined||(o.nextTurn>=0&&o.nextTurn<c.turns.length))))).toBe(true)});
 it('only exposes conjugation tables for the four checked irregular verbs',()=>{expect(Object.keys(checkedConjugations).sort()).toEqual(['estar','fazer','ir','ser','ter'].filter(v=>checkedConjugations[v]).sort());expect(checkedConjugations.ser['Presente']?.tu).toBe('és');expect(checkedConjugations.ter['Presente']?.['vocês/eles/elas']).toBe('têm');expect(checkedConjugations.ir['Presente do Conjuntivo']?.['nós']).toBe('vamos');expect(checkedConjugations.fazer['Futuro do Conjuntivo']?.['vocês/eles/elas']).toBe('fizerem')});
});
