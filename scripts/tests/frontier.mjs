import assert from 'node:assert/strict';
import { newCampaign, connectCamps, inSafeZone, distanceToSafeZone, parseCampaign, activeCharacter, makeItem, equip, postOffer, resolveOffers, cancelOffer, xpThreshold } from '../../src/combat3d/campaign.ts';
import { enclosedAreas, invalidateTerritory } from '../../src/combat3d/territory-rules.ts';
import { recruitmentProfile, candidatesFor } from '../../src/combat3d/recruitment.ts';
import { encounterAllowed, difficultyAt, encounterProfile } from '../../src/combat3d/encounters.ts';
const origin = { lat: 51, lon: 22 }, scale = 0.18;
const s = newCampaign({x: 0, z: 0}, origin);
s.camps.push({id: 'b', parentId: 'camp-1', x: 35, z: 0, route: [{x:0,z:0},{x:35,z:0}], buildings: 0});
s.camps.push({id: 'c', parentId: 'b', x: 17.5, z: 35, route: [{x:35,z:0},{x:17.5,z:35}], buildings: 0});
assert.equal(enclosedAreas(s).length, 0, 'an open V never fills its convex hull');
assert(!inSafeZone(s, {x:17.5,z:12}, scale));
assert(inSafeZone(s, {x:17.5,z:-1.79}, scale));
assert(!inSafeZone(s, {x:17.5,z:-1.81}, scale));
assert(connectCamps(s, 'c', 'camp-1', [{x:17.5,z:35},{x:0,z:0}]));
assert.equal(enclosedAreas(s).length, 1);
assert(inSafeZone(s, {x:17.5,z:12}, scale), 'closing a triangle protects its interior');
assert.equal(distanceToSafeZone(s,{x:17.5,z:12},scale), 0);
assert(!inSafeZone(s, {x:17.5,z:-10}, scale), 'outside stays dangerous');
assert(!connectCamps(s,'camp-1','c',[{x:0,z:0},{x:17.5,z:35}]), 'duplicate reverse link refused');
assert(!connectCamps(s,'camp-1','b',[{x:0,z:0},{x:35,z:0}]), 'existing tree edge refused');
assert(!connectCamps(s,'camp-1','camp-1',[{x:0,z:0},{x:0,z:0}]));
assert(!connectCamps(s,'camp-1','c',[{x:1,z:0},{x:17.5,z:35}]), 'endpoints must be attached');
assert(inSafeZone(parseCampaign(JSON.stringify(s)),{x:17.5,z:12},scale), 'reload preserves closed areas');
const old = newCampaign({x:0,z:0},origin); delete old.connections;
assert(parseCampaign(JSON.stringify(old)), 'legacy saves migrate with no extra connections');
const bad = JSON.parse(JSON.stringify(s)); bad.connections[0].to = 'missing'; assert.equal(parseCampaign(JSON.stringify(bad)),null);
const makePolygon = points => {
  const state = newCampaign(points[0],origin);
  points.slice(1).forEach((p,i) => state.camps.push({...p,id:`p${i+1}`,parentId:state.camps.at(-1).id,route:[points[i],p],buildings:0}));
  assert(connectCamps(state,state.camps.at(-1).id,'camp-1',[points.at(-1),points[0]]));
  return state;
};
const concave = makePolygon([{x:0,z:0},{x:40,z:0},{x:40,z:15},{x:15,z:15},{x:15,z:40},{x:0,z:40}]);
assert(inSafeZone(concave,{x:7,z:25},scale));
assert(!inSafeZone(concave,{x:30,z:30},scale), 'concave cutout stays unsafe');
// A crossing is a graph vertex, never an accidental giant hull.
const crossed = makePolygon([{x:0,z:0},{x:40,z:40},{x:0,z:40},{x:40,z:0}]);
assert.equal(enclosedAreas(crossed).length,2);
assert(inSafeZone(crossed,{x:20,z:8},scale));
assert(!inSafeZone(crossed,{x:-12,z:20},scale));
// Interior spur must not corrupt triangulatable face contours.
s.camps.push({id:'spur',parentId:'b',x:25,z:8,route:[{x:35,z:0},{x:25,z:8}],buildings:0}); invalidateTerritory(s);
assert(inSafeZone(s,{x:17.5,z:12},scale));
assert(enclosedAreas(s).every(r => new Set(r.map(p=>`${p.x}:${p.z}`)).size === r.length));

const base = newCampaign({x:0,z:0},origin);
let nearCount = 0;
for (let i=0;i<10000;i++) {
  nearCount += Number(encounterAllowed(base,{x:12,z:0},`cell-${i}`,scale));
  assert(encounterAllowed(base,{x:40,z:0},`cell-${i}`,scale));
}
assert(nearCount > 4750 && nearCount < 5250, `near density approximately half (${nearCount})`);
assert(!encounterAllowed(base,{x:0,z:0},'home',scale));
const near = difficultyAt(base,{x:15,z:0},scale), wild = difficultyAt(base,{x:600,z:0},scale);
assert(wild.tier > near.tier);
assert.equal(near.bossChance,0); assert(wild.bossChance > 0);
base.camps.push({id:'remote',parentId:'camp-1',x:590,z:0,route:[],buildings:0});
const settled = difficultyAt(base,{x:600,z:0},scale);
assert(settled.tier < wild.tier, 'near new camp pressure is reduced');
assert(settled.tier > near.tier, 'new camp does not erase distance from root');
assert.equal(settled.bossChance,0,'no bosses at the settled frontier');
const distant = difficultyAt(base,{x:1000,z:0},scale); assert(distant.tier > settled.tier);
let bosses=0;
for(let i=0;i<10000;i++) bosses+=Number(encounterProfile(base,{x:1000,z:0},`cell-${i}`,scale).boss);
assert(bosses>0 && bosses<1000,'rare bosses actually occur in deep wilderness');

const reward = {id:'reward',kind:'sword',name:'Miecz',slot:'weapon',icon:'sword',power:7,value:260,level:5,rarity:'common'};
const offer = {id:'o',campId:'camp-1',gold:10,items:[],ceiling:10,readyAt:0,candidates:null,seed:1};
const poor = recruitmentProfile(offer,0), rich = recruitmentProfile({...offer,gold:1000,items:[reward]},0);
assert(rich.chance > poor.chance && rich.chance < 1);
assert(recruitmentProfile({...offer,items:[reward]},0).roles.warrior > 0.65);
const scales = {...reward,kind:'scales',name:'Magiczne łuski',slot:'material',icon:'scales',affinity:'mage'};
assert(recruitmentProfile({...offer,items:[scales]},0).roles.mage > 0.65);
assert(recruitmentProfile({...offer,gold:1000,items:[{...reward,rarity:'legendary'}]},0).maxLevel > rich.maxLevel);
assert(recruitmentProfile({...offer,ceiling:2,gold:100000,items:[{...reward,rarity:'legendary'}]},0).maxLevel <= 2);
let poorSuccess=0, richSuccess=0, warriors=0, total=0;
for (let i=1;i<=4000;i++) {
  const seed = Math.imul(i,7919);
  poorSuccess += Number(candidatesFor({...offer,seed},0).length>0);
  richSuccess += Number(candidatesFor({...offer,seed,gold:1000,items:[reward]},0).length>0);
  const candidates=candidatesFor({...offer,seed,items:[reward]},0);
  total+=candidates.length; warriors+=candidates.filter(c=>c.role==='warrior').length;
}
assert(poorSuccess < richSuccess && poorSuccess > 0 && richSuccess < 4000);
assert(warriors/total > .65,'sword bias is present in actual generated candidates');
const failedState = newCampaign({x:0,z:0},origin), hero=activeCharacter(failedState);
const held=hero.bag[0];
const failedOffer=postOffer(failedState,'camp-1',1,[held.id],0);
for(let seed=1;seed<100000;seed++) if(!candidatesFor({...failedOffer,seed},0).length) {failedOffer.seed=seed;break;}
assert(resolveOffers(failedState,1e9)); assert.deepEqual(failedOffer.candidates,[]);
assert(!resolveOffers(failedState,1e9+1),'failed offer is not rerolled');
assert.deepEqual(parseCampaign(JSON.stringify(failedState)).offers[0].candidates,[]);
assert(cancelOffer(failedState,failedOffer.id)); assert.equal(failedState.bank,1); assert.equal(failedState.vault[0].id,held.id);
hero.bag.push({...scales,id:'scales'}); assert(!equip(hero,'scales'),'materials cannot be equipped');
assert(parseCampaign(JSON.stringify(failedState)),'item metadata survives save validation');
hero.exp=xpThreshold(3); failedState.characters.push({...hero,id:'high-level',exp:xpThreshold(20),bag:[],equipment:{}});
const limited=postOffer(failedState,'camp-1',1,[],0); assert.equal(limited.ceiling,3,'active character level is snapshotted');
console.log('PASS: 10m corridors, closed/concave/crossing loops, save migration, half border density, frontier difficulty/bosses, probabilistic class-weighted recruitment and refunds');
// Exercise actual Three.js geometry construction without claiming a GPU render.
const { territoryModel } = await import('../../src/combat3d/territory.ts');
const covers = (model, p) => {
  const a = model.children[0].geometry.attributes.position;
  const cross = (a,b,c) => (b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
  for(let i=0;i<a.count;i+=3) {
    const tri=[0,1,2].map(j=>({x:a.getX(i+j),z:a.getZ(i+j)}));
    const area=cross(tri[0],tri[1],tri[2]);
    if(Math.abs(area)<1e-7) continue;
    const signs=tri.map((q,j)=>cross(q,tri[(j+1)%3],p));
    if(signs.every(v=>v>=-1e-6)||signs.every(v=>v<=1e-6)) return true;
  }
  return false;
};
const model = territoryModel(concave,()=>true);
assert(covers(model,{x:7,z:25}),'rendered fill covers protected interior');
assert(!covers(model,{x:30,z:30}),'rendered fill respects concave cutout');
for (const child of model.children) assert([...child.geometry.attributes.position.array].every(Number.isFinite));
console.log('PASS: territory mesh triangulation matches closed-area protection');
