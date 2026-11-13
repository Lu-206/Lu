import {z} from 'zod';

const note = z.string().trim().min(1).max(160);
const notes = z.array(note).max(20);
const nullableNote = note.nullable();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0,10) === value;
}, '日期不存在');

export const PreferencesSchema = z.object({
  interests: notes,
  dietaryRestrictions: notes,
  transportPreferences: notes,
  accommodationStyle: nullableNote,
  accommodationArea: nullableNote,
  pace: z.enum(['relaxed','balanced','intensive']).nullable(),
}).strict();
export type Preferences = z.infer<typeof PreferencesSchema>;
export const emptyPreferences = (): Preferences => ({interests:[],dietaryRestrictions:[],transportPreferences:[],accommodationStyle:null,accommodationArea:null,pace:null});

export const RequirementsSchema = z.object({
  destination: nullableNote,
  people: z.object({
    total: z.number().int().min(1).max(100).nullable(),
    adults: z.number().int().min(1).max(100).nullable(),
    children: z.number().int().min(0).max(99).nullable(),
  }).strict(),
  days: z.number().int().min(1).max(60).nullable(),
  budget: z.object({
    amount: z.number().positive().max(10000000).nullable(),
    scope: z.enum(['total','per_person','unknown']),
    currency: z.literal('CNY'),
    flexible: z.boolean(),
  }).strict(),
  dates: z.object({startDate:isoDate.nullable(),endDate:isoDate.nullable(),flexible:z.boolean()}).strict(),
  interests: notes,
  dietaryRestrictions: notes,
  transportPreferences: notes,
  accommodation: z.object({style:nullableNote,area:nullableNote,nightlyBudget:z.number().positive().max(100000).nullable()}).strict(),
  pace: z.enum(['relaxed','balanced','intensive']).nullable(),
}).strict().superRefine((r,ctx) => {
  const issue = (path:(string|number)[], message:string) => ctx.addIssue({code:'custom',path,message});
  const {total,adults,children} = r.people;
  if(total !== null && adults !== null && children !== null && total !== adults + children) issue(['people'],'总人数与成人、儿童人数不一致');
  if(total !== null && ((adults ?? 0) > total || (children ?? 0) >= total)) issue(['people'],'人数不一致');
  if(r.dates.flexible && (r.dates.startDate || r.dates.endDate)) issue(['dates'],'日期灵活与具体日期不能同时存在');
  if(r.dates.endDate && !r.dates.startDate) issue(['dates'],'缺少出发日期');
  if(r.dates.startDate && r.dates.endDate){
    const duration = (Date.parse(r.dates.endDate) - Date.parse(r.dates.startDate)) / 86400000 + 1;
    if(duration < 1) issue(['dates'],'返回日期不能早于出发日期');
    if(r.days !== null && duration !== r.days) issue(['days'],'天数与日期范围不一致');
  }
  if(r.budget.flexible && r.budget.amount !== null) issue(['budget'],'预算灵活与具体金额不能同时存在');
});
export type Requirements = z.infer<typeof RequirementsSchema>;
export const emptyRequirements = (): Requirements => ({
  destination:null,people:{total:null,adults:null,children:null},days:null,
  budget:{amount:null,scope:'unknown',currency:'CNY',flexible:false},
  dates:{startDate:null,endDate:null,flexible:false},interests:[],dietaryRestrictions:[],transportPreferences:[],
  accommodation:{style:null,area:null,nightlyBudget:null},pace:null,
});

export function applyPreferences(r:Requirements,p:Preferences):Requirements {
  return {...r,interests:[...p.interests],dietaryRestrictions:[...p.dietaryRestrictions],transportPreferences:[...p.transportPreferences],
    accommodation:{...r.accommodation,style:p.accommodationStyle,area:p.accommodationArea},pace:p.pace};
}
export function preferencesFrom(r:Requirements):Preferences {
  return PreferencesSchema.parse({interests:r.interests,dietaryRestrictions:r.dietaryRestrictions,transportPreferences:r.transportPreferences,
    accommodationStyle:r.accommodation.style,accommodationArea:r.accommodation.area,pace:r.pace});
}
export const missingRequirements = (r:Requirements) => {
  const missing: {field:string;question:string}[] = [];
  if(!r.destination) missing.push({field:'destination',question:'这次的目的地是北京吗？'});
  if(!r.people.total) missing.push({field:'people',question:'一共几人同行？其中有几位成人和儿童？'});
  if(!r.days) missing.push({field:'days',question:'计划在北京玩几天？'});
  if(!r.budget.flexible && (r.budget.amount === null || r.budget.scope === 'unknown')) missing.push({field:'budget',question:r.budget.amount !== null?'这笔预算是全部人的总预算，还是每人预算？':'预算大约多少？请注明总预算或人均预算，也可以说预算灵活。'});
  if(!r.dates.startDate && !r.dates.flexible) missing.push({field:'dates',question:'计划哪天出发？还没决定可以说“日期未定”。'});
  return missing;
};
export const ModelOutputSchema = z.object({reply:z.string().trim().min(1).max(2000),requirements:RequirementsSchema}).strict();
export const ChatInputSchema = z.object({
  conversationId:z.string().uuid().nullable().default(null),
  message:z.string().trim().min(1).max(3000),
  preferences:PreferencesSchema.optional(),
}).strict();
export const ChatResponseSchema = z.object({
  conversationId:z.string().uuid(),reply:z.string().min(1).max(2000),requirements:RequirementsSchema,
  missing:z.array(z.object({field:z.string(),question:z.string()})),
  questions:z.array(z.string()).max(2),status:z.enum(['collecting','ready','out_of_scope']),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type Message = {role:'user'|'assistant';content:string};
export const paceLabels = {relaxed:'轻松慢游',balanced:'适中节奏',intensive:'充实探索'};
