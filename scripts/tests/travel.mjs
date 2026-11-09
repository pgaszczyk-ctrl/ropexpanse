import assert from 'node:assert/strict';
import { newCampaign, connectCamps, postOffer, resolveOffers, hire, offerAt, activeCharacter, BALANCE } from '../../src/combat3d/campaign.ts';
import { ropeLinks, campLinks, canAddLink, travelCost, travelPlan, linkAt, fartherEnd, MAX_CAMP_LINKS } from '../../src/combat3d/travel.ts';
const origin = { lat: 51, lon: 22 }, scale = 0.18;
const s = newCampaign({ x: 0, z: 0 }, origin);
// A star of camps around camp-1, each 36 units (200 m) away.
for (let i = 0; i < 4; i++) {
  const a = (i * Math.PI) / 2, p = { x: Math.round(Math.sin(a) * 36), z: Math.round(Math.cos(a) * 36) };
  s.camps.push({ id: `s${i}`, parentId: 'camp-1', ...p, route: [{ x: 0, z: 0 }, p], buildings: 0 });
}
assert.equal(ropeLinks(s).length, 4);
assert.equal(campLinks(s, 'camp-1'), MAX_CAMP_LINKS);
assert(!canAddLink(s, 'camp-1'), 'at most four ropes leave one camp');
assert(canAddLink(s, 's0'));
assert(connectCamps(s, 's0', 's1', [{ x: 0, z: 36 }, { x: 36, z: 0 }]));
assert.equal(campLinks(s, 's0'), 2, 'extra connections count too');
// 100 tix per km, never free.
assert.equal(travelCost(1000), 100);
assert.equal(travelCost(200), 20);
assert.equal(travelCost(1), 1);
assert.equal(travelCost(0), 0);
// Tap anywhere on a rope: it is found, the arrow points to the far end, the price is the ride.
const tap = linkAt(s, { x: 0.5, z: 25 }, 1.4);
assert(tap && tap.link.b === 's0');
assert.equal(fartherEnd(tap.link, { x: 0, z: 0 }), 's0');
assert.equal(fartherEnd(tap.link, { x: 0, z: 36 }), 'camp-1');
const plan = travelPlan(s, tap.link, { x: 0, z: 0 }, 's0', scale, BALANCE.safeRadius);
assert(plan.onRope && !plan.arrived);
assert.equal(Math.round(plan.meters), 200);
assert.equal(plan.cost, 20);
const back = travelPlan(s, tap.link, { x: 0, z: 0 }, 'camp-1', scale, BALANCE.safeRadius);
assert(back.arrived, 'riding to the camp you stand at is refused');
const halfway = travelPlan(s, tap.link, { x: 0, z: 18 }, 's0', scale, BALANCE.safeRadius);
assert.equal(halfway.cost, 10, 'from the middle of a rope you pay for the rest of it');
const far = travelPlan(s, tap.link, { x: 30, z: 18 }, 's0', scale, BALANCE.safeRadius);
assert(!far.onRope, 'only a party standing on that rope can ride it');
assert(!linkAt(s, { x: 10, z: 20 }, 1.4), 'a tap away from ropes finds nothing');
// Recruiting: one shared offer, seen from any camp, the hire joins the camp you stand at.
const c = activeCharacter(s);
c.coins = 1000;
const o = postOffer(s, 'camp-1', 600, [], 0);
assert(o);
assert.equal(offerAt(s, 's2'), o, 'another camp shows the same offer');
assert(!postOffer(s, 's2', 10, [], 0), 'no second offer elsewhere');
resolveOffers(s, BALANCE.recruitmentMs);
if (o.candidates.length) {
  const v = hire(s, o.id, o.candidates[0].id, 's2');
  assert.equal(v.campId, 's2');
  assert.equal(v.x, 36 * 0 + s.camps.find((k) => k.id === 's2').x);
}
console.log('PASS: rope travel → 4 ropes per camp, tap anywhere, 100 tix/km, ride only from the rope; one shared recruitment offer for every camp');
