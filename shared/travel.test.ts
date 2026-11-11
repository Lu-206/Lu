import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RequirementsSchema,PreferencesSchema,emptyRequirements,emptyPreferences,applyPreferences,preferencesFrom,missingRequirements} from './travel';
test('unknown values stay missing; total/per-person ambiguity blocks readiness',()=>{
  const r=emptyRequirements();assert.equal(missingRequirements(r).length,5);
  r.destination='北京';r.people.total=2;r.days=3;r.budget.amount=8000;r.dates.flexible=true;
  assert.deepEqual(missingRequirements(r).map(x=>x.field),['budget']);r.budget.scope='total';assert.equal(missingRequirements(r).length,0);
  r.budget={amount:null,scope:'unknown',currency:'CNY',flexible:true};assert.equal(missingRequirements(r).length,0);
});
test('reject impossible dates, inconsistent people and dates/duration; allow leap day',()=>{
  const r=emptyRequirements();r.dates.startDate='2027-02-29';assert.equal(RequirementsSchema.safeParse(r).success,false);
  r.dates.startDate='2028-02-29';assert.equal(RequirementsSchema.safeParse(r).success,true);
  r.dates.endDate='2028-03-02';r.days=2;assert.equal(RequirementsSchema.safeParse(r).success,false);
  r.days=3;assert.equal(RequirementsSchema.safeParse(r).success,true);
  r.people={total:3,adults:2,children:2};assert.equal(RequirementsSchema.safeParse(r).success,false);
});
test('saved preferences exclude trip-specific information and cannot add keys',()=>{
  const r=emptyRequirements();r.destination='北京';r.days=5;r.budget.amount=8000;r.dietaryRestrictions=['不吃花生'];r.pace='relaxed';
  const prefs=preferencesFrom(r);assert.equal('budget' in prefs,false);assert.equal('days' in prefs,false);
  const next=applyPreferences(emptyRequirements(),prefs);assert.deepEqual(next.dietaryRestrictions,['不吃花生']);assert.equal(next.days,null);assert.equal(next.budget.amount,null);
  assert.equal(PreferencesSchema.safeParse({...emptyPreferences(),apiKey:'secret'}).success,false);
});
