(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={weak:{common:.78,rare:.17,epic:.045,legendary:.005},medium:{common:.7,rare:.22,epic:.07,legendary:.01},elite:{common:.4,rare:.4,epic:.17,legendary:.03},boss:{common:0,rare:.5,epic:.4,legendary:.1}},t={weak:.25,medium:.35,elite:1,boss:1};function n(t,n){let r=e[t],i=0;for(let e of[`legendary`,`epic`,`rare`,`common`])if(i+=r[e],n<i)return e;return t===`boss`?`rare`:`common`}function r(e,r,i,a){let o=r===`boss`?100:r===`elite`?35:5+i*2;if(e===`wolf`){let e=r===`elite`||r===`boss`,t=[];return(e||a()<.35)&&t.push(`skora`),(e||a()<.2)&&t.push(`kiel`),{tix:o,materials:t,gear:[]}}let s=[];return a()<t[r]&&s.push(n(r,a())),r===`boss`&&s.push(n(r,a())),{tix:o,materials:[],gear:s}}var i={common:0,rare:2,epic:4,legendary:7},a={common:1,rare:2,epic:4,legendary:8},o=e=>!!e&&e!==`common`;function s(e){let t=Math.max(2,Math.min(8,Math.ceil(e/6))),n=[],r=e;for(let i=0;i<t;i++){let a=i===t-1?r:Math.floor(e/t);n.push(a),r-=a}return n.filter(e=>e>0)}var c={speed:6.3,radius:.43,attackDuration:.38,attackHitAt:.13,attackCooldown:.47,reach:2.9,halfArc:.92,sweepReach:4.2,sweepHalfArc:2.1,sweepCooldown:6,potionCooldown:14,regenDelay:5,safeRadius:7.5},l=(e,t,n)=>Math.max(t,Math.min(n,e)),u=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z),d=(e,t)=>Math.atan2(Math.sin(e-t),Math.cos(e-t));function f(e,t,n,r,i,a=.5){let o=u(e,t);return o<=r+a&&(o<a||Math.abs(d(Math.atan2(t.x-e.x,t.z-e.z),n))<=i)}function p(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++){let o=n[i],s=n[a];o[1]>t!=s[1]>t&&e<(s[0]-o[0])*(t-o[1])/(s[1]-o[1])+o[0]&&(r=!r)}return r}var m=(e,t,n)=>p(e,t,n[0])&&!n.slice(1).some(n=>p(e,t,n));function h(e,t,n){if(m(e.x,e.z,n))return!0;for(let r of n)for(let n=1;n<r.length;n++){let i=r[n-1],a=r[n],o=a[0]-i[0],s=a[1]-i[1],c=o*o+s*s,u=c?l(((e.x-i[0])*o+(e.z-i[1])*s)/c,0,1):0;if(Math.hypot(e.x-i[0]-o*u,e.z-i[1]-s*u)<t)return!0}return!1}function g(e,t,n,r){let i=t.x-e.x,a=t.z-e.z,o=i*i+a*a,s=o?l(((n.x-e.x)*i+(n.z-e.z)*a)/o,0,1):0;return Math.hypot(e.x+i*s-n.x,e.z+a*s-n.z)<=r}var _=.3,v=.1;function y(e,t=v,n=Math.random){return n()<t?0:Math.max(1,Math.round(e*(.7+n()*2*_)))}function b(e,t,n){let r=n.x-t.x,i=n.z-t.z,a=r*r+i*i,o=a?Math.max(0,Math.min(1,((e.x-t.x)*r+(e.z-t.z)*i)/a)):0;return Math.hypot(e.x-t.x-r*o,e.z-t.z-i*o)}function x(e,t,n){return(t.x-e.x)*(n.z-e.z)-(t.z-e.z)*(n.x-e.x)}var S=12,C=450,w=class{cells=new Map;stamp=0;constructor(e){e.forEach((e,t)=>{let n={o:e,i:t,x0:1/0,x1:-1/0,z0:1/0,z1:-1/0,stamp:0};for(let t of e.rings[0])t[0]<n.x0&&(n.x0=t[0]),t[0]>n.x1&&(n.x1=t[0]),t[1]<n.z0&&(n.z0=t[1]),t[1]>n.z1&&(n.z1=t[1]);if(!(n.x0>n.x1))for(let e=Math.floor(n.x0/S);e<=Math.floor(n.x1/S);e++)for(let t=Math.floor(n.z0/S);t<=Math.floor(n.z1/S);t++){let r=e*65536+t,i=this.cells.get(r);i?i.push(n):this.cells.set(r,[n])}})}inBox(e,t,n,r,i,a,o,s=0){let c=++this.stamp;for(let l=Math.floor(e/S);l<=Math.floor(n/S);l++)for(let u=Math.floor(t/S);u<=Math.floor(r/S);u++){if(a&&o&&b({x:(l+.5)*S,z:(u+.5)*S},a,o)>S*.7072+s)continue;let d=this.cells.get(l*65536+u);if(d){for(let a of d)if(a.stamp!==c&&(a.stamp=c,!(a.x1<e||a.x0>n||a.z1<t||a.z0>r)&&i(a)))return!0}}return!1}},T=new WeakMap;function E(e){let t=T.get(e);return t||T.set(e,t=new w(e)),t}function D(e,t,n,r){if(h(e,r,n.rings)||h(t,r,n.rings))return!0;for(let i of n.rings)for(let n=1;n<i.length;n++){let a={x:i[n-1][0],z:i[n-1][1]},o={x:i[n][0],z:i[n][1]};if(x(e,t,a)*x(e,t,o)<0&&x(a,o,e)*x(a,o,t)<0||Math.min(b(e,a,o),b(t,a,o),b(a,e,t),b(o,e,t))<r)return!0}return!1}function O(e,t,n,r=.1){return!E(n).inBox(Math.min(e.x,t.x)-r,Math.min(e.z,t.z)-r,Math.max(e.x,t.x)+r,Math.max(e.z,t.z)+r,n=>D(e,t,n.o,r),e,t,r)}function k(e){return e.slice(1).reduce((t,n,r)=>t+u(e[r],n),0)}function A(e,t,n){let r=e.map(e=>({...e}));if(!r.length)return null;for(r.length>1&&r.pop();r.length>1&&O(r[r.length-2],t,n);)r.pop();let i=r[r.length-1];if(!O(i,t,n)){let e=Math.min(i.x,t.x)-5,a=Math.max(i.x,t.x)+5,o=Math.min(i.z,t.z)-5,s=Math.max(i.z,t.z)+5,c=[];E(n).inBox(e,o,a,s,n=>{let r=D(i,t,n.o,.1);if(!r&&!n.o.rings[0].some(t=>t[0]>=e&&t[0]<=a&&t[1]>=o&&t[1]<=s))return;let l=0;if(!r){l=1/0;for(let e of n.o.rings[0])l=Math.min(l,b({x:e[0],z:e[1]},i,t))}c.push({o:n.o,i:n.i,d:l})});let l=c.sort((e,t)=>e.d-t.d||e.i-t.i).map(e=>e.o);if(l.some(e=>h(t,.1,e.rings)))return null;let d=[i,t],f=E(n);fill:for(let e of l)for(let t of e.rings)for(let e=0;e<t.length-1;e++){let n=t[e];for(let e=0;e<Math.PI*2;e+=Math.PI/4){let t={x:n[0]+Math.sin(e)*.28,z:n[1]+Math.cos(e)*.28};if(f.inBox(t.x-.11,t.z-.11,t.x+.11,t.z+.11,e=>h(t,.11,e.o.rings))||d.push(t),d.length>=C)break fill}}let p=d,m=p.map(()=>1/0),g=p.map(()=>-1),_=p.map(e=>u(e,t)),v=new Set;m[0]=0;for(let e=0;e<p.length;e++){let e=-1;for(let t=0;t<p.length;t++)!v.has(t)&&(e<0||m[t]+_[t]<m[e]+_[e])&&(e=t);if(e<0||!Number.isFinite(m[e])||e===1)break;v.add(e);for(let t=1;t<p.length;t++){if(v.has(t))continue;let r=m[e]+u(p[e],p[t]);r<m[t]&&O(p[e],p[t],n)&&(m[t]=r,g[t]=e)}}if(!Number.isFinite(m[1]))return null;let y=[];for(let e=1;e>0;e=g[e]){if(e<0)return null;y.unshift(p[e])}r.push(...y.slice(0,-1))}return r.push({...t}),r}var j=new WeakMap,ee=e=>j.delete(e);function M(e){return[...e.camps.filter(e=>e.parentId).map(e=>e.route),...(e.connections??[]).map(e=>e.route)]}function te(e){let t=j.get(e);if(t)return t;let n=[];for(let t of M(e))for(let e=1;e<t.length;e++)u(t[e-1],t[e])>1e-6&&n.push({a:t[e-1],b:t[e],cuts:[0,1]});let r=(e,t,n,r)=>e*r-t*n,i=(e,t)=>{if(b(t,e.a,e.b)>1e-6)return;let n=e.b.x-e.a.x,r=e.b.z-e.a.z;e.cuts.push(Math.max(0,Math.min(1,((t.x-e.a.x)*n+(t.z-e.a.z)*r)/(n*n+r*r))))};for(let e=0;e<n.length;e++)for(let t=e+1;t<n.length;t++){let a=n[e],o=n[t],s=a.b.x-a.a.x,c=a.b.z-a.a.z,l=o.b.x-o.a.x,u=o.b.z-o.a.z,d=r(s,c,l,u),f=o.a.x-a.a.x,p=o.a.z-a.a.z;if(Math.abs(d)>1e-9){let e=r(f,p,l,u)/d,t=r(f,p,s,c)/d;e>=-1e-8&&e<=1+1e-8&&t>=-1e-8&&t<=1+1e-8&&(a.cuts.push(Math.max(0,Math.min(1,e))),o.cuts.push(Math.max(0,Math.min(1,t))))}else i(a,o.a),i(a,o.b),i(o,a.a),i(o,a.b)}let a=[],o=new Map,s=[],c=e=>{let t=`${Math.round(e.x*1e5)}:${Math.round(e.z*1e5)}`,n=o.get(t);return n===void 0&&(n=a.length,o.set(t,n),a.push(e),s.push(new Set)),n};for(let e of n){let t=[...new Set(e.cuts)].sort((e,t)=>e-t),n=-1;for(let r of t){let t=c({x:e.a.x+(e.b.x-e.a.x)*r,z:e.a.z+(e.b.z-e.a.z)*r});n>=0&&t!==n&&(s[n].add(t),s[t].add(n)),n=t}}let l=s.map((e,t)=>[...e].sort((e,n)=>Math.atan2(a[e].z-a[t].z,a[e].x-a[t].x)-Math.atan2(a[n].z-a[t].z,a[n].x-a[t].x))),d=new Set,f=[];for(let e=0;e<a.length;e++)for(let t of l[e]){let n=e,r=t,i=[];for(;!d.has(`${n}:${r}`);){d.add(`${n}:${r}`),i.push(n);let e=l[r],t=e[(e.indexOf(n)+e.length-1)%e.length];n=r,r=t}if(n!==e||r!==t)continue;let o=!0;for(;o&&i.length>2;){o=!1;for(let e=0;e<i.length;e++)if(i[(e+i.length-1)%i.length]===i[(e+1)%i.length]){i.splice(e,1),i.splice(e%i.length,1),o=!0;break}}let s=i.map(e=>a[e]);s.reduce((e,t,n)=>{let r=s[(n+1)%s.length];return e+t.x*r.z-r.x*t.z},0)/2>1e-5&&f.push(s)}return j.set(e,f),f}function ne(e,t){return p(e.x,e.z,t.map(e=>[e.x,e.z]))}function re(e,t,n,r,i){let a=Math.min(...e.camps.map(e=>u(e,t)-r));for(let r of M(e))for(let e=1;e<r.length;e++)a=Math.min(a,b(t,r[e-1],r[e])-i*n);for(let n of te(e)){if(ne(t,n))return 0;for(let e=0;e<n.length;e++)a=Math.min(a,b(t,n[e],n[(e+1)%n.length]))}return Math.max(0,a)}var ie={common:`Zwykły`,rare:`Rzadki`,epic:`Epicki`,legendary:`Legendarny`},ae={common:`#9A9A9A`,rare:`#3F8FE0`,epic:`#C77DFF`,legendary:`#E8B53A`},oe={common:.5,rare:1,epic:1.5,legendary:1.5},se={warrior:[{id:`stun5`,name:`Ciężka ręka`,text:`co 5. cios ogłusza`},{id:`lastStand`,name:`Upór`,text:`poniżej 30% życia przyjmuje mniej obrażeń`}],mage:[{id:`volatile`,name:`Iskra`,text:`zabity wróg wybucha`},{id:`doubleBolt`,name:`Echo`,text:`pocisk czasem uderza podwójnie`}],archer:[{id:`firstCrit`,name:`Pierwsza strzała`,text:`pierwszy strzał w walce zawsze krytyczny`},{id:`evasion`,name:`Zwinność`,text:`czasem unika ciosu`}],herbalist:[{id:`bloom`,name:`Dobra ręka`,text:`leczy mocniej`},{id:`quickRevive`,name:`Na nogi`,text:`powaleni w drużynie wstają szybciej`}],woodcutter:[{id:`diligent`,name:`Pracowitość`,text:`pracuje szybciej`}],miner:[{id:`diligent`,name:`Pracowitość`,text:`pracuje szybciej`}],ropemaker:[{id:`diligent`,name:`Pracowitość`,text:`pracuje szybciej`}]},N={warrior:{id:`unbroken`,name:`Niezłomność`,text:`ogłusza co 4. ciosem i nie spada poniżej 1 życia raz na walkę`},mage:{id:`lantern`,name:`Latarnik`,text:`wokół niego Mgła się przerzedza: wrogowie zadają mniej, spod nóg sypią się iskry`},archer:{id:`hawk`,name:`Sokole oko`,text:`każdy strzał po 3 s spokoju jest krytyczny, unika co piątego ciosu`},herbalist:{id:`lifebloom`,name:`Źródło`,text:`leczy całą drużynę naraz, a powaleni wstają od razu po walce`},woodcutter:{id:`master`,name:`Mistrz`,text:`pracuje dwa razy szybciej`},miner:{id:`master`,name:`Mistrz`,text:`pracuje dwa razy szybciej`},ropemaker:{id:`master`,name:`Mistrz`,text:`pracuje dwa razy szybciej`}},ce={warrior:[[`Waleczny`,`Waleczna`,`the Valiant`],[`Niezłomny`,`Niezłomna`,`the Unbroken`]],mage:[[`Mądry`,`Mądra`,`the Wise`]],archer:[[`Bystrooki`,`Bystrooka`,`the Keen-eyed`]],herbalist:[[`Dobry`,`Dobra`,`the Kind`]],woodcutter:[[`Pracowity`,`Pracowita`,`the Diligent`]],miner:[[`Pracowity`,`Pracowita`,`the Diligent`]],ropemaker:[[`Pracowity`,`Pracowita`,`the Diligent`]]};function le(e,t){return[...se[e],N[e]].find(e=>e.id===t)}var ue=[[`pl`,49,54.9,14.1,24.2],[`slav`,53.9,59.7,20.9,28.3],[`scandinavia`,54.5,71.5,4.5,31.6],[`latam`,-56,32.5,-118,-34],[`northam`,15,72,-170,-52],[`med`,35,44.2,-10,28.5],[`slav`,41,70,18.9,60],[`westeu`,42,61,-11,18.9],[`mena`,12,42,-18,63],[`ssa`,-35,15,-18,52],[`southasia`,5,37,60,92],[`eastasia`,-11,54,92,146],[`oceania`,-48,-10,110,180]];function de(e,t){for(let[n,r,i,a,o]of ue)if(e>=r&&e<=i&&t>=a&&t<=o)return n;return`westeu`}var fe=e=>e.split(`,`).map(e=>e.trim()),pe={pl:{m:fe(`Mieczysław, Bogdan, Jan, Piotr, Krzysztof, Tomasz, Wojciech, Marek, Kazimierz, Stanisław, Zbigniew, Jakub, Antoni, Franciszek, Szymon, Bartosz, Łukasz, Grzegorz, Władysław, Leszek`),f:fe(`Jadwiga, Bogna, Anna, Maria, Katarzyna, Małgorzata, Agnieszka, Barbara, Zofia, Helena, Krystyna, Ewa, Joanna, Magdalena, Dorota, Wanda, Grażyna, Halina, Jolanta, Urszula`)},slav:{m:fe(`Dmitri, Ivan, Bohdan, Miroslav, Vladimír, Oleksandr, Pavel, Milan, Dušan, Yaroslav, Andrej, Taras, Radek, Luboš, Stanislav, Vasyl, Igor, Boris, Zoran, Petr`),f:fe(`Olena, Natalia, Milena, Daria, Svetlana, Lucie, Zuzana, Oksana, Vesna, Ludmila, Tatiana, Irina, Jana, Veronika, Mariya, Kateřina, Bojana, Yulia, Nadia, Alena`)},scandinavia:{m:fe(`Sigurd, Halvar, Erik, Lars, Bjørn, Gunnar, Magnus, Leif, Torsten, Ragnar, Anders, Olav, Henrik, Nils, Ivar, Sven, Johan, Eino, Mikko, Rasmus`),f:fe(`Astrid, Sigrid, Ingrid, Freja, Solveig, Liv, Karin, Elin, Saga, Maja, Linnea, Helga, Ronja, Tuva, Aino, Hanna, Signe, Ylva, Kerstin, Eira`)},westeu:{m:fe(`Gaspard, Hugo, Louis, Mathis, Lukas, Felix, Oliver, Arthur, Liam, Noah, Henri, Jules, Maximilian, Finn, Théo, Emil, Pieter, Daan, Callum, Rory`),f:fe(`Margot, Élodie, Camille, Léa, Emma, Charlotte, Sophie, Clara, Amélie, Lena, Hannah, Isla, Freya, Chloé, Inès, Marie, Lotte, Fenna, Siobhan, Niamh`)},med:{m:fe(`Lorenzo, Matteo, Alessandro, Giovanni, Marco, Pablo, Javier, Diego, Carlos, Álvaro, João, Tiago, Nikos, Giorgos, Dimitris, Andrea, Luca, Sergio, Rafael, Miguel`),f:fe(`Lucia, Chiara, Giulia, Sofia, Francesca, Martina, Elena, Carmen, Lucía, Paula, Inés, Beatriz, Mariana, Eleni, Katerina, Alessia, Valeria, Marta, Irene, Rosa`)},mena:{m:fe(`Karim, Tarik, Omar, Youssef, Ahmed, Amir, Hassan, Samir, Khalid, Nabil, Rami, Farid, Ali, Mehmet, Emre, Reza, Darius, Bilal, Malik, Ziad`),f:fe(`Leila, Yasmin, Amira, Nour, Fatima, Salma, Rania, Zainab, Hana, Mariam, Layla, Dina, Sara, Elif, Zeynep, Shirin, Aylin, Lina, Noor, Huda`)},ssa:{m:fe(`Kwame, Tunde, Kofi, Chidi, Emeka, Juma, Baraka, Sipho, Thabo, Oluwaseun, Kamau, Abebe, Moussa, Ibrahima, Tendai, Jabari, Ade, Kayode, Lwazi, Mandla`),f:fe(`Amara, Ngozi, Ama, Chiamaka, Adaeze, Zawadi, Nia, Thandiwe, Nomvula, Folake, Wanjiru, Abena, Aminata, Fatoumata, Makena, Imani, Ayana, Lerato, Zuri, Yetunde`)},eastasia:{m:fe(`Haruto, Kenji, Takumi, Ren, Hiroshi, Wei, Jun, Hao, Ming, Minjun, Seojun, Hyun, Daiki, Sota, Yuto, Long, Jian, Kai, Tuan, Somchai`),f:fe(`Aiko, Mei, Yui, Sakura, Hina, Mio, Xiu, Lan, Jia, Yuna, Seoyeon, Jiwoo, Haeun, Rin, Akari, Ling, Xin, Linh, Mai, Ploy`)},southasia:{m:fe(`Arjun, Rohan, Aarav, Vihaan, Rahul, Vikram, Kabir, Aditya, Sanjay, Imran, Faisal, Tenzin, Nikhil, Ravi, Amit, Dev, Kiran, Suresh, Ishaan, Pranav`),f:fe(`Priya, Ananya, Aisha, Diya, Kavya, Meera, Saanvi, Neha, Pooja, Riya, Isha, Lakshmi, Sana, Ayesha, Nisha, Tara, Anjali, Divya, Shreya, Zara`)},latam:{m:fe(`Mateo, Joaquín, Santiago, Sebastián, Diego, Tomás, Benjamín, Martín, Lucas, Gabriel, Emiliano, Nicolás, Felipe, Alejandro, Rodrigo, Thiago, Andrés, Leonardo, Bruno, Iker`),f:fe(`Valentina, Camila, Isabella, Sofía, Martina, Lucía, Mariana, Ximena, Renata, Florencia, Catalina, Antonella, Daniela, Gabriela, Paula, Julieta, Fernanda, Victoria, Emilia, Luana`)},northam:{m:fe(`Wyatt, Logan, Mason, Ethan, Jackson, Caleb, Owen, Hunter, Carter, Grayson, Landon, Ryan, Tyler, Austin, Cole, Brody, Dylan, Nathan, Eli, Jonah`),f:fe(`Hazel, Riley, Avery, Harper, Madison, Aubrey, Brooklyn, Savannah, Paisley, Kennedy, Peyton, Taylor, Addison, Skylar, Claire, Ellie, Nora, Piper, Quinn, Sadie`)},oceania:{m:fe(`Lachlan, Hamish, Cooper, Angus, Fletcher, Jack, Archie, Harrison, Tane, Nikau, Mitchell, Bailey, Flynn, Oscar, Hudson, Kieran, Rhys, Ari, Toby, Lincoln`),f:fe(`Matilda, Isla, Ruby, Georgia, Poppy, Mia, Aroha, Kaia, Willow, Sienna, Indie, Billie, Zoe, Grace, Evie, Lily, Maeve, Harriet, Tahlia, Ivy`)}},me=Object.keys(pe);function he(e,t,n,r,i={}){let a=Math.max(0,Math.min(1,i.rarityLift??0)),o=e(),s=i.legendary?`legendary`:o<.06+a*.12?`epic`:o<.3+a*.25?`rare`:`common`,c=e()<.5?`m`:`f`,l=e()<.2?me[Math.floor(e()*me.length)]:n,u=pe[l][c].filter(e=>!r.has(e)),d=u[Math.floor(e()*u.length)]??`${pe[l][c][0]} ${r.size+1}`,f=s===`legendary`?N[t].id:se[t][Math.floor(e()*se[t].length)].id,p=ce[t];return{name:d,sex:c,rarity:s,trait:f,title:s===`legendary`?p[Math.floor(e()*p.length)][c===`m`?0:1]:void 0,region:l}}var ge=e=>e.title?`${e.name} ${e.title}`:e.name,_e={common:0,uncommon:1,rare:2,epic:4,legendary:7};function ve(e){return _e[e.rarity??`common`]}function ye(e){return e.affinity??(e.icon===`sword`?`warrior`:e.icon===`staff`||e.icon===`scales`?`mage`:e.icon===`bow`?`archer`:void 0)}function be(e,t){let n=Math.max(0,e.gold)+e.items.reduce((e,t)=>e+t.value*(1+ve(t)*.15),0),r={warrior:1,mage:1,archer:1,herbalist:.7,woodcutter:.45,miner:.45,ropemaker:.45};for(let t of e.items){let e=ye(t);e&&(r[e]+=Math.sqrt(t.value/35)*(1+ve(t)*.25))}let i=Object.values(r).reduce((e,t)=>e+t,0),a=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,t/i])),o=Math.max(0,...e.items.filter(e=>e.slot===`weapon`).map(e=>Math.max(0,(e.level??Math.max(1,Math.floor(e.power/3)))-1)*.6+ve(e))),s=Math.max(1,Math.min(100,e.ceiling,1+Math.floor(Math.sqrt(n/120)+o)));return{chance:n<=0?0:Math.min(.97,.05+.86*(1-Math.exp(-n/220))+Math.min(.06,Math.log2(1+Math.max(0,t))*.012)),roles:a,maxLevel:s,minLevel:Math.max(1,s-Math.ceil(s*.4)+1),extraChance:Math.min(.65,n/2200+Math.log2(1+Math.max(0,t))*.04)}}function xe(e,t,n=`pl`,r=new Set){let i=e.seed,a=()=>(i=Math.imul(i,1664525)+1013904223|0,(i>>>0)/4294967296),o=be(e,t);if(a()>=o.chance)return[];let s=1;for(;s<4&&a()<o.extraChance;)s++;let c=Math.max(0,e.gold)+e.items.reduce((e,t)=>e+t.value,0),l=new Set(r);return Array.from({length:s},(t,r)=>{let i=a(),s=`warrior`,u=0;for(let[e,t]of Object.entries(o.roles))if(u+=t,s=e,i<u)break;a();let d=Math.floor(a()*1e4),f=Math.max(1,o.maxLevel-Math.floor(a()*Math.max(1,Math.ceil(o.maxLevel*.4)))),p=e.seed^Math.imul(r+1,2654435761)|0,m=he(()=>(p=Math.imul(p,1664525)+1013904223|0,(p>>>0)/4294967296),s,n,l,{rarityLift:Math.min(1,c/2500)});return l.add(m.name),{id:`${e.id}-candidate-${r}`,...m,role:s,appearance:d,level:f}})}var Se=Uint8Array,Ce=Uint16Array,P=Int32Array,we=new Se([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Te=new Se([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ee=new Se([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),F=function(e,t){for(var n=new Ce(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new P(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},De=F(we,2),I=De.b,Oe=De.r;I[28]=258,Oe[258]=28;var ke=F(Te,0),Ae=ke.b;ke.r;for(var je=new Ce(32768),Me=0;Me<32768;++Me){var Ne=(Me&43690)>>1|(Me&21845)<<1;Ne=(Ne&52428)>>2|(Ne&13107)<<2,Ne=(Ne&61680)>>4|(Ne&3855)<<4,je[Me]=((Ne&65280)>>8|(Ne&255)<<8)>>1}for(var Pe=(function(e,t,n){for(var r=e.length,i=0,a=new Ce(t);i<r;++i)e[i]&&++a[e[i]-1];var o=new Ce(t);for(i=1;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new Ce(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[je[d]>>c]=l}else for(s=new Ce(r),i=0;i<r;++i)e[i]&&(s[i]=je[o[e[i]-1]++]>>15-e[i]);return s}),Fe=new Se(288),Me=0;Me<144;++Me)Fe[Me]=8;for(var Me=144;Me<256;++Me)Fe[Me]=9;for(var Me=256;Me<280;++Me)Fe[Me]=7;for(var Me=280;Me<288;++Me)Fe[Me]=8;for(var Ie=new Se(32),Me=0;Me<32;++Me)Ie[Me]=5;var Le=Pe(Fe,9,1),Re=Pe(Ie,5,1),ze=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Be=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},Ve=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},He=function(e){return(e+7)/8|0},Ue=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new Se(e.subarray(t,n))},We=[`unexpected EOF`,`invalid block type`,`invalid length/literal`,`invalid distance`,`stream finished`,`no stream handler`,,`no callback`,`invalid UTF-8 data`,`extra field too long`,`date not in range 1980-2099`,`filename too long`,`stream finishing`,`invalid zip data`],Ge=function(e,t,n){var r=Error(t||We[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Ge),!n)throw r;return r},Ke=function(e,t,n,r){var i=e.length,a=r?r.length:0;if(!i||t.f&&!t.l)return n||new Se(0);var o=!n,s=o||t.i!=2,c=t.i;o&&(n=new Se(i*3));var l=function(e){var t=n.length;if(e>t){var r=new Se(Math.max(t*2,e));r.set(n),n=r}},u=t.f||0,d=t.p||0,f=t.b||0,p=t.l,m=t.d,h=t.m,g=t.n,_=i*8;do{if(!p){u=Be(e,d,1);var v=Be(e,d+1,3);if(d+=3,!v){var y=He(d)+4,b=e[y-4]|e[y-3]<<8,x=y+b;if(x>i){c&&Ge(0);break}s&&l(f+b),n.set(e.subarray(y,x),f),t.b=f+=b,t.p=d=x*8,t.f=u;continue}if(v==1)p=Le,m=Re,h=9,g=5;else if(v==2){var S=Be(e,d,31)+257,C=Be(e,d+10,15)+4,w=S+Be(e,d+5,31)+1;d+=14;for(var T=new Se(w),E=new Se(19),D=0;D<C;++D)E[Ee[D]]=Be(e,d+D*3,7);d+=C*3;for(var O=ze(E),k=(1<<O)-1,A=Pe(E,O,1),D=0;D<w;){var j=A[Be(e,d,k)];d+=j&15;var y=j>>4;if(y<16)T[D++]=y;else{var ee=0,M=0;for(y==16?(M=3+Be(e,d,3),d+=2,ee=T[D-1]):y==17?(M=3+Be(e,d,7),d+=3):y==18&&(M=11+Be(e,d,127),d+=7);M--;)T[D++]=ee}}var te=T.subarray(0,S),ne=T.subarray(S);h=ze(te),g=ze(ne),p=Pe(te,h,1),m=Pe(ne,g,1)}else Ge(1);if(d>_){c&&Ge(0);break}}s&&l(f+131072);for(var re=(1<<h)-1,ie=(1<<g)-1,ae=d;;ae=d){var ee=p[Ve(e,d)&re],oe=ee>>4;if(d+=ee&15,d>_){c&&Ge(0);break}if(ee||Ge(2),oe<256)n[f++]=oe;else if(oe==256){ae=d,p=null;break}else{var se=oe-254;if(oe>264){var D=oe-257,N=we[D];se=Be(e,d,(1<<N)-1)+I[D],d+=N}var ce=m[Ve(e,d)&ie],le=ce>>4;ce||Ge(3),d+=ce&15;var ne=Ae[le];if(le>3){var N=Te[le];ne+=Ve(e,d)&(1<<N)-1,d+=N}if(d>_){c&&Ge(0);break}s&&l(f+131072);var ue=f+se;if(f<ne){var de=a-ne,fe=Math.min(ne,ue);for(de+f<0&&Ge(3);f<fe;++f)n[f]=r[de+f]}for(;f<ue;++f)n[f]=n[f-ne]}}t.l=p,t.p=ae,t.b=f,t.f=u,p&&(u=1,t.m=h,t.d=m,t.n=g)}while(!u);return f!=n.length&&o?Ue(n,0,f):n.subarray(0,f)},qe=new Se(0),Je=function(e){(e[0]!=31||e[1]!=139||e[2]!=8)&&Ge(6,`invalid gzip data`);var t=e[3],n=10;t&4&&(n+=(e[10]|e[11]<<8)+2);for(var r=(t>>3&1)+(t>>4&1);r>0;r-=!e[n++]);return n+(t&2)},Ye=function(e){var t=e.length;return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0},Xe=function(e,t){return((e[0]&15)!=8||e[0]>>4>7||(e[0]<<8|e[1])%31)&&Ge(6,`invalid zlib data`),(e[1]>>5&1)==+!t&&Ge(6,`invalid zlib data: `+(e[1]&32?`need`:`unexpected`)+` dictionary`),(e[1]>>3&4)+2};function Ze(e,t){return Ke(e,{i:2},t&&t.out,t&&t.dictionary)}function Qe(e,t){var n=Je(e);return n+8>e.length&&Ge(6,`invalid gzip data`),Ke(e.subarray(n,-8),{i:2},t&&t.out||new Se(Ye(e)),t&&t.dictionary)}function $e(e,t){return Ke(e.subarray(Xe(e,t&&t.dictionary),-4),{i:2},t&&t.out,t&&t.dictionary)}function et(e,t){return e[0]==31&&e[1]==139&&e[2]==8?Qe(e,t):(e[0]&15)!=8||e[0]>>4>7||(e[0]<<8|e[1])%31?Ze(e,t):$e(e,t)}var tt=typeof TextDecoder<`u`&&new TextDecoder;try{tt.decode(qe,{stream:!0})}catch{}var nt=Object.defineProperty,rt=Math.pow,it=(e,t)=>nt(e,`name`,{value:t,configurable:!0}),at=(e,t,n)=>new Promise((r,i)=>{var a=e=>{try{s(n.next(e))}catch(e){i(e)}},o=e=>{try{s(n.throw(e))}catch(e){i(e)}},s=e=>e.done?r(e.value):Promise.resolve(e.value).then(a,o);s((n=n.apply(e,t)).next())});it((e,t)=>{let n=!1,r=``;return new(L.GridLayer.extend({createTile:it((t,i)=>{let a=document.createElement(`img`),o=new AbortController,s=o.signal;return a.cancel=()=>{o.abort()},n||=(e.getHeader().then(e=>{e.tileType===1||e.tileType===6?console.error(`Error: archive contains vector tiles, but leafletRasterLayer is for displaying raster tiles. See https://github.com/protomaps/PMTiles/tree/main/js for details.`):e.tileType===2?r=`image/png`:e.tileType===3?r=`image/jpeg`:e.tileType===4?r=`image/webp`:e.tileType===5&&(r=`image/avif`)}),!0),e.getZxy(t.z,t.x,t.y,s).then(e=>{if(e){let t=new Blob([e.data],{type:r}),n=window.URL.createObjectURL(t);a.src=n}else a.style.display=`none`;a.cancel=void 0,i(void 0,a)}).catch(e=>{if(e.name!==`AbortError`)throw e}),a},`createTile`),_removeTile:it(function(e){let t=this._tiles[e];t&&(t.el.cancel&&t.el.cancel(),t.el.src&&window.URL.revokeObjectURL(t.el.src),t.el.width=0,t.el.height=0,t.el.deleted=!0,L.DomUtil.remove(t.el),delete this._tiles[e],this.fire(`tileunload`,{tile:t.el,coords:this._keyToTileCoords(e)}))},`_removeTile`)}))(t)},`leafletRasterLayer`);var ot=it(e=>(t,n)=>{if(n instanceof AbortController)return e(t,n);let r=new AbortController;return e(t,r).then(e=>n(void 0,e.data,e.cacheControl||``,e.expires||``),e=>n(e)).catch(e=>n(e)),{cancel:it(()=>r.abort(),`cancel`)}},`v3compat`);it(class{constructor(e){this.tilev4=it((e,t)=>at(this,null,function*(){if(e.type===`json`){let n=e.url.substr(10),r=this.tiles.get(n);if(r||(r=new Mt(n),this.tiles.set(n,r)),this.metadata){let n=yield r.getTileJson(e.url);return t.signal.throwIfAborted(),{data:n}}let i=yield r.getHeader();return t.signal.throwIfAborted(),(i.minLon>=i.maxLon||i.minLat>=i.maxLat)&&console.error(`Bounds of PMTiles archive ${i.minLon},${i.minLat},${i.maxLon},${i.maxLat} are not valid.`),{data:{tiles:[`${e.url}/{z}/{x}/{y}`],minzoom:i.minZoom,maxzoom:i.maxZoom,bounds:[i.minLon,i.minLat,i.maxLon,i.maxLat]}}}let n=new RegExp(/pmtiles:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/),r=e.url.match(n);if(!r)throw Error(`Invalid PMTiles protocol URL`);let i=r[1],a=this.tiles.get(i);a||(a=new Mt(i),this.tiles.set(i,a));let o=r[2],s=r[3],c=r[4],l=yield a?.getZxy(+o,+s,+c,t.signal);if(t.signal.throwIfAborted(),l)return{data:new Uint8Array(l.data),cacheControl:l.cacheControl,expires:l.expires};let u=yield a.getHeader();if(u.tileType===1||u.tileType===6){if(this.errorOnMissingTile)throw Error(`Tile not found.`);return{data:new Uint8Array}}return{data:null}}),`tilev4`),this.tile=ot(this.tilev4),this.tiles=new Map,this.metadata=e?.metadata||!1,this.errorOnMissingTile=e?.errorOnMissingTile||!1}add(e){this.tiles.set(e.source.getKey(),e)}get(e){return this.tiles.get(e)}},`Protocol`);function st(e,t){return(t>>>0)*4294967296+(e>>>0)}it(st,`toNum`);function ct(e,t){let n=t.buf,r=n[t.pos++],i=(r&112)>>4;if(r<128||(r=n[t.pos++],i|=(r&127)<<3,r<128)||(r=n[t.pos++],i|=(r&127)<<10,r<128)||(r=n[t.pos++],i|=(r&127)<<17,r<128)||(r=n[t.pos++],i|=(r&127)<<24,r<128)||(r=n[t.pos++],i|=(r&1)<<31,r<128))return st(e,i);throw Error(`Expected varint not more than 10 bytes`)}it(ct,`readVarintRemainder`);function lt(e){let t=e.buf,n=t[e.pos++],r=n&127;return n<128||(n=t[e.pos++],r|=(n&127)<<7,n<128)||(n=t[e.pos++],r|=(n&127)<<14,n<128)||(n=t[e.pos++],r|=(n&127)<<21,n<128)?r:(n=t[e.pos],r|=(n&15)<<28,ct(r,e))}it(lt,`readVarint`);function ut(e,t,n,r,i){return i===0?r===0?[n,t]:[e-1-n,e-1-t]:[t,n]}it(ut,`rotate`);function dt(e,t,n){if(e>26)throw Error(`Tile zoom level exceeds max safe number limit (26)`);if(t>=1<<e||n>=1<<e)throw Error(`tile x/y outside zoom level bounds`);let r=((1<<e)*(1<<e)-1)/3,i=e-1,[a,o]=[t,n];for(let e=1<<i;e>0;e>>=1){let t=a&e,n=o&e;r+=(3*t^n)*(1<<i),[a,o]=ut(e,a,o,t,n),i--}return r}it(dt,`zxyToTileId`);function ft(e){let t=3*e+1;return t<4294967296?31-Math.clz32(t):63-Math.clz32(t/4294967296)}it(ft,`tileIdToZ`);function pt(e){let t=ft(e)>>1;if(t>26)throw Error(`Tile zoom level exceeds max safe number limit (26)`);let n=e-((1<<t)*(1<<t)-1)/3,r=0,i=0,a=1<<t;for(let e=1;e<a;e<<=1){let t=e&n/2,a=e&(n^t);[r,i]=ut(e,r,i,t,a),n/=2,r+=t,i+=a}return[t,r,i]}it(pt,`tileIdToZxy`);var mt=(e=>(e[e.Unknown=0]=`Unknown`,e[e.None=1]=`None`,e[e.Gzip=2]=`Gzip`,e[e.Brotli=3]=`Brotli`,e[e.Zstd=4]=`Zstd`,e))(mt||{});function ht(e,t){return at(this,null,function*(){if(t===1||t===0)return e;if(t===2){if(globalThis.DecompressionStream===void 0)return et(new Uint8Array(e));let t=new Response(e).body;if(!t)throw Error(`Failed to read response stream`);let n=t.pipeThrough(new globalThis.DecompressionStream(`gzip`));return new Response(n).arrayBuffer()}throw Error(`Compression method not supported`)})}it(ht,`defaultDecompress`);var gt=(e=>(e[e.Unknown=0]=`Unknown`,e[e.Mvt=1]=`Mvt`,e[e.Png=2]=`Png`,e[e.Jpeg=3]=`Jpeg`,e[e.Webp=4]=`Webp`,e[e.Avif=5]=`Avif`,e[e.Mlt=6]=`Mlt`,e))(gt||{});function _t(e){return e===1?`.mvt`:e===2?`.png`:e===3?`.jpg`:e===4?`.webp`:e===5?`.avif`:e===6?`.mlt`:``}it(_t,`tileTypeExt`);var vt=127;function yt(e,t){let n=0,r=e.length-1;for(;n<=r;){let i=r+n>>1,a=t-e[i].tileId;if(a>0)n=i+1;else if(a<0)r=i-1;else return e[i]}return r>=0&&(e[r].runLength===0||t-e[r].tileId<e[r].runLength)?e[r]:null}it(yt,`findTile`),it(class{constructor(e){this.file=e}getKey(){return this.file.name}getBytes(e,t){return at(this,null,function*(){return{data:yield this.file.slice(e,e+t).arrayBuffer()}})}},`FileSource`);var bt=class{constructor(e,t=new Headers,n=void 0){this.url=e,this.customHeaders=t,this.credentials=n,this.mustReload=!1;let r=``;`navigator`in globalThis&&(r=globalThis.navigator?.userAgent??``);let i=r.indexOf(`Windows`)>-1,a=/Chrome|Chromium|Edg|OPR|Brave/.test(r);this.chromeWindowsNoCache=!1,i&&a&&(this.chromeWindowsNoCache=!0)}getKey(){return this.url}setHeaders(e){this.customHeaders=e}getBytes(e,t,n,r){return at(this,null,function*(){let i,a;n?a=n:(i=new AbortController,a=i.signal);let o=new Headers(this.customHeaders);o.set(`range`,`bytes=${e}-${e+t-1}`);let s;this.mustReload?s=`reload`:this.chromeWindowsNoCache&&(s=`no-store`);let c=yield fetch(this.url,{signal:a,cache:s,headers:o,credentials:this.credentials});if(e===0&&c.status===416){let e=c.headers.get(`Content-Range`);if(!e||!e.startsWith(`bytes */`))throw Error(`Missing content-length on 416 response`);let t=+e.substr(8);o.set(`range`,`bytes=0-${t-1}`),c=yield fetch(this.url,{signal:a,cache:`reload`,headers:o,credentials:this.credentials})}let l=c.headers.get(`Etag`);if(l!=null&&l.startsWith(`W/`)&&(l=null),c.status===416||r&&l&&l!==r)throw this.mustReload=!0,new Et(`Server returned non-matching ETag ${r} after one retry. Check browser extensions and servers for issues that may affect correct ETag headers.`);if(c.status>=300)throw Error(`Bad response code: ${c.status}`);let u=c.headers.get(`Content-Length`);if(c.status===200&&(!u||+u>t))throw i&&i.abort(),Error(`Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.`);return{data:yield c.arrayBuffer(),etag:l||void 0,cacheControl:c.headers.get(`Cache-Control`)||void 0,expires:c.headers.get(`Expires`)||void 0}})}};it(bt,`FetchSource`);var xt=bt;function St(e,t){let n=e.getUint32(t+4,!0),r=e.getUint32(t+0,!0);return n*rt(2,32)+r}it(St,`getUint64`);function Ct(e,t){let n=new DataView(e),r=n.getUint8(7);if(r>3)throw Error(`Archive is spec version ${r} but this library supports up to spec version 3`);return{specVersion:r,rootDirectoryOffset:St(n,8),rootDirectoryLength:St(n,16),jsonMetadataOffset:St(n,24),jsonMetadataLength:St(n,32),leafDirectoryOffset:St(n,40),leafDirectoryLength:St(n,48),tileDataOffset:St(n,56),tileDataLength:St(n,64),numAddressedTiles:St(n,72),numTileEntries:St(n,80),numTileContents:St(n,88),clustered:n.getUint8(96)===1,internalCompression:n.getUint8(97),tileCompression:n.getUint8(98),tileType:n.getUint8(99),minZoom:n.getUint8(100),maxZoom:n.getUint8(101),minLon:n.getInt32(102,!0)/1e7,minLat:n.getInt32(106,!0)/1e7,maxLon:n.getInt32(110,!0)/1e7,maxLat:n.getInt32(114,!0)/1e7,centerZoom:n.getUint8(118),centerLon:n.getInt32(119,!0)/1e7,centerLat:n.getInt32(123,!0)/1e7,etag:t}}it(Ct,`bytesToHeader`);function wt(e){let t={buf:new Uint8Array(e),pos:0},n=lt(t),r=[],i=0;for(let e=0;e<n;e++){let e=lt(t);r.push({tileId:i+e,offset:0,length:0,runLength:1}),i+=e}for(let e=0;e<n;e++)r[e].runLength=lt(t);for(let e=0;e<n;e++)r[e].length=lt(t);for(let e=0;e<n;e++){let n=lt(t);n===0&&e>0?r[e].offset=r[e-1].offset+r[e-1].length:r[e].offset=n-1}return r}it(wt,`deserializeIndex`);var Tt=class extends Error{};it(Tt,`EtagMismatch`);var Et=Tt;function Dt(e,t){return at(this,null,function*(){let n=yield e.getBytes(0,16384);if(new DataView(n.data).getUint16(0,!0)!==19792)throw Error(`Wrong magic number for PMTiles archive`);let r=Ct(n.data.slice(0,vt),n.etag),i=n.data.slice(r.rootDirectoryOffset,r.rootDirectoryOffset+r.rootDirectoryLength),a=`${e.getKey()}|${r.etag||``}|${r.rootDirectoryOffset}|${r.rootDirectoryLength}`,o=wt(yield t(i,r.internalCompression));return[r,[a,o.length,o]]})}it(Dt,`getHeaderAndRoot`);function Ot(e,t,n,r,i,a){return at(this,null,function*(){let o=wt(yield t((yield e.getBytes(n,r,a,i.etag)).data,i.internalCompression));if(o.length===0)throw Error(`Empty directory is invalid`);return o})}it(Ot,`getDirectory`),it(class{constructor(e=100,t=!0,n=ht){this.cache=new Map,this.maxCacheEntries=e,this.counter=1,this.decompress=n}getHeader(e){return at(this,null,function*(){let t=e.getKey(),n=this.cache.get(t);if(n)return n.lastUsed=this.counter++,n.data;let r=yield Dt(e,this.decompress);return r[1]&&this.cache.set(r[1][0],{lastUsed:this.counter++,data:r[1][2]}),this.cache.set(t,{lastUsed:this.counter++,data:r[0]}),this.prune(),r[0]})}getDirectory(e,t,n,r,i){return at(this,null,function*(){let a=`${e.getKey()}|${r.etag||``}|${t}|${n}`,o=this.cache.get(a);if(o)return o.lastUsed=this.counter++,o.data;let s=yield Ot(e,this.decompress,t,n,r,i);return this.cache.set(a,{lastUsed:this.counter++,data:s}),this.prune(),s})}prune(){if(this.cache.size>this.maxCacheEntries){let e=1/0,t;this.cache.forEach((n,r)=>{n.lastUsed<e&&(e=n.lastUsed,t=r)}),t&&this.cache.delete(t)}}invalidate(e){return at(this,null,function*(){this.cache.delete(e.getKey())})}},`ResolvedValueCache`);var kt=class{constructor(e=100,t=!0,n=ht){this.cache=new Map,this.invalidations=new Map,this.pendingFetches=new Map,this.maxCacheEntries=e,this.counter=1,this.decompress=n}getHeader(e){return at(this,null,function*(){let t=e.getKey(),n=this.cache.get(t);if(n)return n.lastUsed=this.counter++,yield n.data;let r=new Promise((t,n)=>{Dt(e,this.decompress).then(e=>{e[1]&&this.cache.set(e[1][0],{lastUsed:this.counter++,data:Promise.resolve(e[1][2])}),t(e[0]),this.prune()}).catch(e=>{n(e)})});return this.cache.set(t,{lastUsed:this.counter++,data:r}),r})}trackSignal(e,t,n){t.refs++,n.addEventListener(`abort`,()=>{--t.refs<=0&&this.pendingFetches.get(e)===t&&(t.controller.abort(),this.cache.delete(e),this.pendingFetches.delete(e))},{once:!0})}getDirectory(e,t,n,r,i){return at(this,null,function*(){let a=`${e.getKey()}|${r.etag||``}|${t}|${n}`,o=this.cache.get(a);if(o){o.lastUsed=this.counter++;let e=this.pendingFetches.get(a);return e&&this.trackSignal(a,e,i??new AbortController().signal),yield o.data}let s=new AbortController,c={controller:s,refs:0};this.trackSignal(a,c,i??new AbortController().signal),this.pendingFetches.set(a,c);let l=new Promise((i,o)=>{Ot(e,this.decompress,t,n,r,s.signal).then(e=>{this.pendingFetches.delete(a),i(e),this.prune()}).catch(e=>{o(e)})});return this.cache.set(a,{lastUsed:this.counter++,data:l}),l})}prune(){if(this.cache.size>=this.maxCacheEntries){let e=1/0,t;this.cache.forEach((n,r)=>{n.lastUsed<e&&(e=n.lastUsed,t=r)}),t&&this.cache.delete(t)}}invalidate(e){return at(this,null,function*(){let t=e.getKey();if(this.invalidations.get(t))return yield this.invalidations.get(t);this.cache.delete(e.getKey());let n=new Promise((n,r)=>{this.getHeader(e).then(e=>{n(),this.invalidations.delete(t)}).catch(e=>{r(e)})});this.invalidations.set(t,n)})}};it(kt,`SharedPromiseCache`);var At=kt,jt=class{constructor(e,t,n){this.source=typeof e==`string`?new xt(e):e,this.decompress=n||ht,this.cache=t||new At}getHeader(){return at(this,null,function*(){return yield this.cache.getHeader(this.source)})}getZxyAttempt(e,t,n,r){return at(this,null,function*(){let i=dt(e,t,n),a=yield this.cache.getHeader(this.source);if(r?.throwIfAborted(),e<a.minZoom||e>a.maxZoom)return;let o=a.rootDirectoryOffset,s=a.rootDirectoryLength;for(let e=0;e<=3;e++){let e=yield this.cache.getDirectory(this.source,o,s,a,r);r?.throwIfAborted();let t=yt(e,i);if(t){if(t.runLength>0){let e=yield this.source.getBytes(a.tileDataOffset+t.offset,t.length,r,a.etag);return{data:yield this.decompress(e.data,a.tileCompression),cacheControl:e.cacheControl,expires:e.expires}}o=a.leafDirectoryOffset+t.offset,s=t.length}else return}throw Error(`Maximum directory depth exceeded`)})}getZxy(e,t,n,r){return at(this,null,function*(){try{return yield this.getZxyAttempt(e,t,n,r)}catch(i){if(i instanceof Et)return this.cache.invalidate(this.source),yield this.getZxyAttempt(e,t,n,r);throw i}})}getMetadataAttempt(){return at(this,null,function*(){let e=yield this.cache.getHeader(this.source),t=yield this.source.getBytes(e.jsonMetadataOffset,e.jsonMetadataLength,void 0,e.etag),n=yield this.decompress(t.data,e.internalCompression),r=new TextDecoder(`utf-8`);return JSON.parse(r.decode(n))})}getMetadata(){return at(this,null,function*(){try{return yield this.getMetadataAttempt()}catch(e){if(e instanceof Et)return this.cache.invalidate(this.source),yield this.getMetadataAttempt();throw e}})}getTileJson(e){return at(this,null,function*(){let t=yield this.getHeader(),n=yield this.getMetadata();return{tilejson:`3.0.0`,scheme:`xyz`,tiles:[`${e}/{z}/{x}/{y}${_t(t.tileType)}`],vector_layers:n.vector_layers,attribution:n.attribution,description:n.description,name:n.name,version:n.version,bounds:[t.minLon,t.minLat,t.maxLon,t.maxLat],center:[t.centerLon,t.centerLat,t.centerZoom],minzoom:t.minZoom,maxzoom:t.maxZoom}})}};it(jt,`PMTiles`);var Mt=jt;function Nt(e,t){this.x=e,this.y=t}Nt.prototype={clone(){return new Nt(this.x,this.y)},add(e){return this.clone()._add(e)},sub(e){return this.clone()._sub(e)},multByPoint(e){return this.clone()._multByPoint(e)},divByPoint(e){return this.clone()._divByPoint(e)},mult(e){return this.clone()._mult(e)},div(e){return this.clone()._div(e)},rotate(e){return this.clone()._rotate(e)},rotateAround(e,t){return this.clone()._rotateAround(e,t)},matMult(e){return this.clone()._matMult(e)},unit(){return this.clone()._unit()},perp(){return this.clone()._perp()},round(){return this.clone()._round()},mag(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals(e){return this.x===e.x&&this.y===e.y},dist(e){return Math.sqrt(this.distSqr(e))},distSqr(e){let t=e.x-this.x,n=e.y-this.y;return t*t+n*n},angle(){return Math.atan2(this.y,this.x)},angleTo(e){return Math.atan2(this.y-e.y,this.x-e.x)},angleWith(e){return this.angleWithSep(e.x,e.y)},angleWithSep(e,t){return Math.atan2(this.x*t-this.y*e,this.x*e+this.y*t)},_matMult(e){let t=e[0]*this.x+e[1]*this.y,n=e[2]*this.x+e[3]*this.y;return this.x=t,this.y=n,this},_add(e){return this.x+=e.x,this.y+=e.y,this},_sub(e){return this.x-=e.x,this.y-=e.y,this},_mult(e){return this.x*=e,this.y*=e,this},_div(e){return this.x/=e,this.y/=e,this},_multByPoint(e){return this.x*=e.x,this.y*=e.y,this},_divByPoint(e){return this.x/=e.x,this.y/=e.y,this},_unit(){return this._div(this.mag()),this},_perp(){let e=this.y;return this.y=this.x,this.x=-e,this},_rotate(e){let t=Math.cos(e),n=Math.sin(e),r=t*this.x-n*this.y,i=n*this.x+t*this.y;return this.x=r,this.y=i,this},_rotateAround(e,t){let n=Math.cos(e),r=Math.sin(e),i=t.x+n*(this.x-t.x)-r*(this.y-t.y),a=t.y+r*(this.x-t.x)+n*(this.y-t.y);return this.x=i,this.y=a,this},_round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},constructor:Nt},Nt.convert=function(e){if(e instanceof Nt)return e;if(Array.isArray(e))return new Nt(+e[0],+e[1]);if(e.x!==void 0&&e.y!==void 0)return new Nt(+e.x,+e.y);throw Error(`Expected [x, y] or {x, y} point format`)};var Pt=class{constructor(e,t,n,r,i){for(this.properties=Object.create(null),this.extent=n,this.type=0,this.id=void 0,this._pbf=e,this._geometry=-1,this._keys=r,this._values=i;e.pos<t;){let t=e.readVarint();if(t===8)this.id=e.readVarint();else if(t===18){let t=e.readVarint()+e.pos;for(;e.pos<t;){let t=r[e.readVarint()],n=i[e.readVarint()];this.properties[t]=n}}else t===24?this.type=e.readVarint():(t===34&&(this._geometry=e.pos),e.skip(t))}}loadGeometry(){if(this._geometry<0)throw Error(`feature has no geometry`);let e=this._pbf;e.pos=this._geometry;let t=e.readVarint()+e.pos,n=[],r,i=1,a=0,o=0,s=0;for(;e.pos<t;){if(a<=0){let t=e.readVarint();if(i=t&7,a=t>>3,a===0)continue}if(a--,i===1)o+=e.readSVarint(),s+=e.readSVarint(),r&&n.push(r),r=[new Nt(o,s)];else if(i===2)o+=e.readSVarint(),s+=e.readSVarint(),r&&r.push(new Nt(o,s));else if(i===7)r&&r.push(r[0].clone());else throw Error(`unknown command ${i}`)}return r&&n.push(r),n}bbox(){if(this._geometry<0)throw Error(`feature has no geometry`);let e=this._pbf;e.pos=this._geometry;let t=e.readVarint()+e.pos,n=1,r=0,i=0,a=0,o=1/0,s=-1/0,c=1/0,l=-1/0;for(;e.pos<t;){if(r<=0){let t=e.readVarint();if(n=t&7,r=t>>3,r===0)continue}if(r--,n===1||n===2)i+=e.readSVarint(),a+=e.readSVarint(),i<o&&(o=i),i>s&&(s=i),a<c&&(c=a),a>l&&(l=a);else if(n!==7)throw Error(`unknown command ${n}`)}return[o,c,s,l]}toGeoJSON(e,t,n){let r=this.extent*2**n,i=this.extent*e,a=this.extent*t,o=this.loadGeometry();function s(e){return[(e.x+i)*360/r-180,360/Math.PI*Math.atan(Math.exp((1-(e.y+a)*2/r)*Math.PI))-90]}function c(e){return e.map(s)}let l;if(this.type===1){let e=[];for(let t of o)e.push(t[0]);let t=c(e);l=e.length===1?{type:`Point`,coordinates:t[0]}:{type:`MultiPoint`,coordinates:t}}else if(this.type===2){let e=o.map(c);l=e.length===1?{type:`LineString`,coordinates:e[0]}:{type:`MultiLineString`,coordinates:e}}else if(this.type===3){let e=Ft(o),t=[];for(let n of e)t.push(n.map(c));l=t.length===1?{type:`Polygon`,coordinates:t[0]}:{type:`MultiPolygon`,coordinates:t}}else throw Error(`unknown feature type`);let u={type:`Feature`,geometry:l,properties:this.properties};return this.id!=null&&(u.id=this.id),u}};Pt.types=[`Unknown`,`Point`,`LineString`,`Polygon`];function Ft(e){let t=e.length;if(t<=1)return[e];let n=[],r,i;for(let a=0;a<t;a++){let t=It(e[a]);t!==0&&(i===void 0&&(i=t<0),i===t<0?(r&&n.push(r),r=[e[a]]):r&&r.push(e[a]))}return r&&n.push(r),n}function It(e){let t=0;for(let n=0,r=e.length,i=r-1,a,o;n<r;i=n++)a=e[n],o=e[i],t+=(o.x-a.x)*(a.y+o.y);return t}var Lt=class{constructor(e,t){for(this.version=1,this.name=``,this.extent=4096,this.length=0,this._pbf=e,this._keys=[],this._values=[],this._features=[],t===void 0&&(t=e.length);e.pos<t;){let t=e.readVarint();t===10?this.name=e.readString():t===18?(this._features.push(e.pos),e.skip(t)):t===26?this._keys.push(e.readString()):t===34?this._values.push(Rt(e)):t===40?this.extent=e.readVarint():t===120?this.version=e.readVarint():e.skip(t)}this.length=this._features.length}feature(e){if(e<0||e>=this._features.length)throw Error(`feature index out of bounds`);this._pbf.pos=this._features[e];let t=this._pbf.readVarint()+this._pbf.pos;return new Pt(this._pbf,t,this.extent,this._keys,this._values)}};function Rt(e){let t=null,n=e.readVarint()+e.pos;for(;e.pos<n;){let n=e.readVarint();t=n===10?e.readString():n===21?e.readFloat():n===25?e.readDouble():n===32?e.readVarint(!0):n===40?e.readVarint():n===48?e.readSVarint():n===56?e.readBoolean():(e.skip(n),null)}if(t==null)throw Error(`unknown feature value`);return t}var zt=class{constructor(e,t=e.length){let n=Object.create(null);for(;e.pos<t;){let t=e.readVarint();if(t===26){let t=new Lt(e,e.readVarint()+e.pos);t.length&&(n[t.name]=t)}else e.skip(t)}this.layers=n}},Bt=4294967296,Vt=12,Ht=typeof TextDecoder>`u`?null:new TextDecoder(`utf-8`),Ut=0,Wt=1,Gt=2,Kt=5,qt=class{constructor(e){this.buf=ArrayBuffer.isView(e)?e:new Uint8Array(e),this.dataView=new DataView(this.buf.buffer,this.buf.byteOffset,this.buf.byteLength),this.pos=0,this.type=0,this._valueStart=-1,this.length=this.buf.length}readFields(e,t,n=this.length){let r;for(;r=this.nextField(n);)e(r,t,this);return t}readMessage(e,t){return this.readFields(e,t,this.readVarint()+this.pos)}readFixed32(){let e=this.dataView.getUint32(this.pos,!0);return this.pos+=4,e}readSFixed32(){let e=this.dataView.getInt32(this.pos,!0);return this.pos+=4,e}readFixed64(){let e=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*Bt;return this.pos+=8,e}readSFixed64(){let e=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*Bt;return this.pos+=8,e}readFloat(){let e=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,e}readDouble(){let e=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,e}readVarint(e){let t=this.buf,n=t[this.pos++];if(n<128)return n;let r=n&127,i;return i=t[this.pos++],r|=(i&127)<<7,i<128||(i=t[this.pos++],r|=(i&127)<<14,i<128)||(i=t[this.pos++],r|=(i&127)<<21,i<128)?r:(i=t[this.pos],r|=(i&15)<<28,Jt(r,e,this))}readSVarint(){let e=this.readVarint();return e%2==1?(e+1)/-2:e/2}readBoolean(){return!!this.readVarint()}readString(){let e=this.readVarint()+this.pos,t=this.pos;return this.pos=e,e-t>=Vt&&Ht?Ht.decode(this.buf.subarray(t,e)):Xt(this.buf,t,e)}readBytes(){let e=this.readVarint()+this.pos,t=this.buf.subarray(this.pos,e);return this.pos=e,t}readPackedVarint(e=[],t){let n=this.readPackedEnd();for(;this.pos<n;)e.push(this.readVarint(t));return e}readPackedSVarint(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readSVarint());return e}readPackedBoolean(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readBoolean());return e}readPackedFloat(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readFloat());return e}readPackedDouble(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readDouble());return e}readPackedFixed32(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readFixed32());return e}readPackedSFixed32(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readSFixed32());return e}readPackedFixed64(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readFixed64());return e}readPackedSFixed64(e=[]){let t=this.readPackedEnd();for(;this.pos<t;)e.push(this.readSFixed64());return e}readPackedEnd(){return this.type===Gt?this.readVarint()+this.pos:this.pos+1}nextField(e=this.length){if(this.pos===this._valueStart&&this.skip(this.type),this.pos>=e)return 0;let t=this.readVarint();return this.type=t&7,this._valueStart=this.pos,t>>>3}skip(e){let t=e&7;if(t===Ut)for(;this.buf[this.pos++]>127;);else if(t===Gt)this.pos=this.readVarint()+this.pos;else if(t===Kt)this.pos+=4;else if(t===Wt)this.pos+=8;else throw Error(`Unimplemented type: ${t}`)}};function Jt(e,t,n){let r=n.buf,i,a;if(a=r[n.pos++],i=(a&112)>>4,a<128||(a=r[n.pos++],i|=(a&127)<<3,a<128)||(a=r[n.pos++],i|=(a&127)<<10,a<128)||(a=r[n.pos++],i|=(a&127)<<17,a<128)||(a=r[n.pos++],i|=(a&127)<<24,a<128)||(a=r[n.pos++],i|=(a&1)<<31,a<128))return Yt(e,i,t);throw Error(`Expected varint not more than 10 bytes`)}function Yt(e,t,n){return n?t*4294967296+(e>>>0):(t>>>0)*4294967296+(e>>>0)}function Xt(e,t,n){let r=``,i=t;for(;i<n;){let t=e[i],a=null,o=t>239?4:t>223?3:t>191?2:1;if(i+o>n)break;let s,c,l;o===1?t<128&&(a=t):o===2?(s=e[i+1],(s&192)==128&&(a=(t&31)<<6|s&63,a<=127&&(a=null))):o===3?(s=e[i+1],c=e[i+2],(s&192)==128&&(c&192)==128&&(a=(t&15)<<12|(s&63)<<6|c&63,(a<=2047||a>=55296&&a<=57343)&&(a=null))):o===4&&(s=e[i+1],c=e[i+2],l=e[i+3],(s&192)==128&&(c&192)==128&&(l&192)==128&&(a=(t&15)<<18|(s&63)<<12|(c&63)<<6|l&63,(a<=65535||a>=1114112)&&(a=null))),a===null?(a=65533,o=1):a>65535&&(a-=65536,r+=String.fromCharCode(a>>>10&1023|55296),a=56320|a&1023),r+=String.fromCharCode(a),i+=o}return r}var Zt=`https://pub-e885d1b5314941a1bc22df18bed8e25d.r2.dev/world-20261103.pmtiles`;function Qt(){return(typeof location>`u`?null:new URLSearchParams(location.search).get(`world`))||{BASE_URL:`./`,DEV:!1,MODE:`production`,PROD:!0,SSR:!1}.VITE_WORLD_URL||Zt}var $t,en=``;function tn(){return $t??=new Mt(en||Qt())}var nn=e=>Math.floor((e+180)/360*2**15),rn=e=>Math.floor((1-Math.asinh(Math.tan(e*Math.PI/180))/Math.PI)/2*2**15),an=e=>e/2**15*360-180,on=e=>Math.atan(Math.sinh(Math.PI*(1-2*e/2**15)))*180/Math.PI;function sn(e,t){let n=e,r=[[e=>e.x>=0,(e,t)=>cn(e,t,(0-e.x)/(t.x-e.x))],[e=>e.x<=t,(e,n)=>cn(e,n,(t-e.x)/(n.x-e.x))],[e=>e.y>=0,(e,t)=>cn(e,t,(0-e.y)/(t.y-e.y))],[e=>e.y<=t,(e,n)=>cn(e,n,(t-e.y)/(n.y-e.y))]];for(let[e,t]of r){let r=n;n=[];for(let i=0;i<r.length;i++){let a=r[(i+r.length-1)%r.length],o=r[i];e(o)?(e(a)||n.push(t(a,o)),n.push(o)):e(a)&&n.push(t(a,o))}if(!n.length)break}return n}var cn=(e,t,n)=>({x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n});function ln(e,t){let n=[],r=[],i=e=>e.x>=0&&e.x<=t&&e.y>=0&&e.y<=t;for(let a=0;a<e.length;a++){let o=e[a];if(a>0){let s=un(e[a-1],o,t);s&&(r.length||r.push(s[0]),r.push(s[1])),s&&i(o)||(r.length>1&&n.push(r),r=[])}}return r.length>1&&n.push(r),n}function un(e,t,n){let r=0,i=1,a=t.x-e.x,o=t.y-e.y;for(let[t,s]of[[-a,e.x],[a,n-e.x],[-o,e.y],[o,n-e.y]]){if(t===0){if(s<0)return null;continue}let e=s/t;if(t<0){if(e>i)return null;e>r&&(r=e)}else{if(e<r)return null;e<i&&(i=e)}}return[cn(e,t,r),cn(e,t,i)]}function dn(e){let t=0;for(let n=0,r=e.length-1;n<e.length;r=n++)t+=(e[r].x-e[n].x)*(e[r].y+e[n].y);return t}function fn(e,t){let n=[];for(let r of e.loadGeometry()){let e=dn(r)>0,i=sn(r,t);i.length<3||(e||!n.length?n.push([i]):n[n.length-1].push(i))}return n}var pn={sidewalk:`footway`,crossing:`footway`,corridor:`footway`,bridleway:`path`},mn=[`buildings`,`roads`,`water`,`landuse`];async function hn(e,t){let n=await tn().getZxy(15,e,t);if(!n)return[];let r=new zt(new qt(new Uint8Array(n.data))),i=an(e),a=an(e+1),o=on(t),s=on(t+1),c=[];for(let[n,l]of mn.entries()){n&&await new Promise(e=>setTimeout(e,0));let u=r.layers[l];if(!u)continue;let d=u.extent,f=e=>({lat:o+(s-o)*(e.y/d),lon:i+(a-i)*(e.x/d)}),p=(r,i)=>((((e&4095)*4096+(t&4095))*4+n)*131072+r%131072)*1024+i%1024;for(let e=0;e<u.length;e++){let t=u.feature(e),n=t.properties,r=String(n.kind??``),i=String(n.kind_detail??``),a=n.name?{name:String(n.name)}:{},o;if(l===`buildings`&&t.type===3&&r===`building`&&(o={building:`yes`,...a}),l===`buildings`&&o&&n.height&&(o.height=String(n.height)),l===`water`&&t.type===3&&(o={natural:`water`,...a}),l===`landuse`&&t.type===3&&r&&(o=r===`park`?{leisure:`park`,...a}:{landuse:r,...a}),l===`roads`&&t.type===2){if(r===`rail`||r===`ferry`||r===`aerialway`)continue;let n=r===`path`?pn[i]??(i||`path`):i||r;for(let[r,i]of t.loadGeometry().flatMap(e=>ln(e,d)).entries())c.push({type:`way`,id:p(e,r),tags:{highway:n,...a},geometry:i.map(f)})}else if(o)for(let[n,r]of fn(t,d).entries()){let t=r.map(e=>{let t=e.map(f);return t.push(t[0]),t});t.length===1?c.push({type:`way`,id:p(e,n),tags:o,geometry:t[0]}):c.push({type:`relation`,id:p(e,n),tags:o,members:t.map((e,t)=>({type:`way`,role:t?`inner`:`outer`,geometry:e}))})}}}return c}var gn=new Map;function _n(e,t){e=(e%2**15+2**15)%2**15;let n=`${e}/${t}`,r=gn.get(n);if(r)return gn.delete(n),gn.set(n,r),r;for(r=hn(e,t),r.catch(()=>gn.delete(n)),gn.set(n,r);gn.size>48;)gn.delete(gn.keys().next().value);return r}async function vn(e){let t=[];for(let n=nn(e.west);n<=nn(e.east-1e-9);n++)for(let r=rn(e.north);r<=rn(e.south+1e-9);r++)t.push(_n(n,r));return(await Promise.all(t)).flat().filter(t=>{let n=90,r=180,i=-90,a=-180;for(let e of t.geometry??t.members?.flatMap(e=>e.geometry??[])??[])e.lat<n&&(n=e.lat),e.lat>i&&(i=e.lat),e.lon<r&&(r=e.lon),e.lon>a&&(a=e.lon);return n<=e.north&&i>=e.south&&r<=e.east&&a>=e.west})}var yn=96,bn=1500,xn;function Sn(){return xn??=new Promise((e,t)=>{let n=indexedDB.open(`ropexpanse-tiles`,1);n.onupgradeneeded=()=>{n.result.createObjectStore(`tiles`,{keyPath:`key`}).createIndex(`savedAt`,`savedAt`);try{indexedDB.deleteDatabase(`ropexpanse-world`)}catch{}},n.onsuccess=()=>{n.result.onversionchange=()=>n.result.close(),e(n.result)},n.onerror=()=>t(n.error),n.onblocked=()=>t(Error(`tile store is busy`))})}async function Cn(e){let t=(async()=>{try{let t=await Sn();return await new Promise((n,r)=>{let i=t.transaction(`tiles`).objectStore(`tiles`).get(e);i.onsuccess=()=>n(i.result),i.onerror=()=>r(i.error)})}catch{return}})();return Promise.race([t,new Promise(e=>setTimeout(e,bn))])}async function wn(e){try{let t=await Sn();await new Promise((n,r)=>{let i=t.transaction(`tiles`,`readwrite`);i.objectStore(`tiles`).put(e),i.oncomplete=()=>n(),i.onerror=()=>r(i.error)});let n=t.transaction(`tiles`,`readwrite`).objectStore(`tiles`),r=n.count();r.onsuccess=()=>{let e=r.result-yn;if(e<=0)return;let t=n.index(`savedAt`).openKeyCursor();t.onsuccess=()=>{let r=t.result;!r||e--<=0||(n.delete(r.primaryKey),r.continue())}}}catch{}}async function Tn(e,t){let n=await Cn(e);if(n&&n.v===2)return n;let r={v:2,key:e,elements:await vn(t),savedAt:Date.now()};return wn(r),r}var En=.18,Dn=.006,On=`https://overpass.private.coffee/api/interpreter`,kn=111320,An=e=>((e+180)%360+360)%360-180;function jn(e,t){return{x:An(e.lon-t.lon)*kn*Math.max(1e-5,Math.cos(t.lat*Math.PI/180))*En,z:(t.lat-e.lat)*kn*En}}function Mn(e,t){return{lat:Math.max(-90,Math.min(90,t.lat-e.z/(kn*En))),lon:An(t.lon+e.x/(kn*Math.max(1e-5,Math.cos(t.lat*Math.PI/180))*En))}}function Nn(e){let t=-90+(e+.5)*Dn;return Math.max(1,Math.ceil(360*Math.max(1e-5,Math.cos(t*Math.PI/180))/Dn))}function Pn(e){let t=Math.min(29999,Math.max(0,Math.floor((Math.max(-90,Math.min(90,e.lat))+90)/Dn))),n=Nn(t);return{x:Math.min(n-1,Math.floor((An(e.lon)+180)/360*n)),y:t}}function Fn(e,t){let n=360/Nn(t);return{south:-90+t*Dn,west:-180+e*n,north:Math.min(90,-90+(t+1)*Dn),east:Math.min(180,-180+(e+1)*n)}}function In(e){let t=2166136261;for(let n of e)t=Math.imul(t^n.charCodeAt(0),16777619);return t>>>0}function Ln(e){let t=e.map(e=>e.slice()),n=[],r=(e,t)=>e.lat===t.lat&&e.lon===t.lon;for(;t.length;){let e=t.shift(),i=!0;for(;i&&!r(e[0],e[e.length-1]);){i=!1;for(let n=0;n<t.length;n++){let a=t[n];if(r(e.at(-1),a.at(-1))&&(a=a.slice().reverse()),r(e.at(-1),a[0])){e.push(...a.slice(1)),t.splice(n,1),i=!0;break}}}e.length>=4&&r(e[0],e.at(-1))&&n.push(e)}return n}function Rn(e,t){let n={origin:t,scale:En,radius:1/0,buildings:[],roads:[],areas:[]},r=new Set;for(let t of e)if(t.type===`relation`&&(t.tags?.building||t.tags?.water||t.tags?.natural===`water`))for(let e of t.members??[])e.type===`way`&&r.add(e.ref);let i=e=>e.map(e=>{let n=jn(e,t);return[n.x,n.z]});for(let a of e){let e=a.tags??{},o=`${a.type}/${a.id}`;if(a.type===`way`&&r.has(a.id))continue;let s=a.type===`relation`?Ln((a.members??[]).filter(e=>e.role!==`inner`&&e.geometry?.length).map(e=>e.geometry)):a.geometry?.length?[a.geometry]:[],c=a.type===`relation`?Ln((a.members??[]).filter(e=>e.role===`inner`&&e.geometry?.length).map(e=>e.geometry)):[];if(e.highway&&a.geometry?.length){let t=[`footway`,`path`,`steps`,`cycleway`,`track`,`pedestrian`].includes(e.highway);n.roads.push({id:o,pts:i(a.geometry),width:Math.max(.35,Math.min(3,(Number.parseFloat(e.width)||(t?2:6))*En)),path:t,name:e.name??``})}else for(let r=0;r<s.length;r++){let a=s[r];if(a.length<4||a[0].lat!==a.at(-1).lat||a[0].lon!==a.at(-1).lon)continue;let l=i(a),u=[l,...c.filter(e=>zn(jn(e[0],t),l)).map(i)];e.building?n.buildings.push({id:`${o}/${r}`,rings:u,height:Math.max(1,Math.min(10,(Number.parseFloat(e.height)||Number(e[`building:levels`])*3||6)*En)),name:e.name??``,address:e[`addr:street`]??``}):(e.landuse||e.leisure||e.natural===`water`||e.water)&&n.areas.push({id:`${o}/${r}`,rings:u,water:e.natural===`water`||!!e.water||e.landuse===`reservoir`,name:e.name??``,kind:e.landuse??e.leisure??e.natural})}}return n}function zn(e,t){let n=!1;for(let r=0,i=t.length-1;r<t.length;i=r++){let a=t[r],o=t[i];a[1]>e.z!=o[1]>e.z&&e.x<(o[0]-a[0])*(e.z-a[1])/(o[1]-a[1])+a[0]&&(n=!n)}return n}var Bn=()=>new Promise(e=>setTimeout(e,0)),Vn=e=>typeof requestIdleCallback==`function`?requestIdleCallback(e,{timeout:4e3}):setTimeout(e,50),Hn,Un=0,Wn=8e3,Gn=3e4,Kn=new Map;function qn(){if(Hn!==void 0)return Hn;if(Hn=null,typeof Worker>`u`||typeof location>`u`)return null;try{let e=new Worker(new URL(new URL(`tileWorker-CYJ0FjtU.js`,import.meta.url).href,``+import.meta.url),{type:`module`});e.onmessage=e=>{let t=Kn.get(e.data.id);t&&(Kn.delete(e.data.id),e.data.tile?t.resolve(e.data.tile):t.reject(Error(e.data.error||`Mapa niedostępna`)))},e.onerror=()=>{Hn=null;for(let[e,t]of Kn)Kn.delete(e),Tn(t.key,t.box).then(t.resolve,t.reject)},Hn=e}catch{Hn=null}return Hn}function Jn(e,t){let n=qn();return n?new Promise((r,i)=>{let a=++Un;Kn.set(a,{resolve:r,reject:i,key:e,box:t}),n.postMessage({id:a,key:e,box:t,world:Qt()}),setTimeout(()=>{Kn.delete(a)&&(Hn===n&&(Hn=null),console.warn(`Tile worker did not answer; reading tiles on the main thread`),Tn(e,t).then(r,i))},Wn)}):Tn(e,t)}async function Yn(e,t){let n=t();n&&await new Promise(e=>setTimeout(e,n));let r=`${e.south},${e.west},${e.north},${e.east}`,i=`[out:json][timeout:20];(way[building](${r});relation[building](${r});way[highway](${r});way[natural=water](${r});relation[natural=water](${r});way[landuse](${r});way[leisure=park](${r}););out geom;`,a=await fetch(On,{method:`POST`,body:new URLSearchParams({data:i}),signal:AbortSignal.timeout(25e3)});if(!a.ok)throw Error(`HTTP ${a.status}`);let o=await a.json();if(!Array.isArray(o.elements)||o.remark)throw Error(`Niepełne dane mapy`);return o.elements}var Xn=class{origin;tiles=new Map;loading=!1;error=``;changed=!1;wanted=[];failures=new Map;lastRequest=0;generation=0;seed;pinned=[];pinCenter=null;constructor(e,t){this.origin=e,this.seed=t}contains(e,t=1){if(this.seed&&Math.abs(e.x)<this.seed.radius-t&&Math.abs(e.z)<this.seed.radius-t)return!0;for(let n of[-t,t])for(let r of[-t,t]){let t=Pn(Mn({x:e.x+n,z:e.z+r},this.origin));if(!this.tiles.has(`${t.x}:${t.y}`))return!1}return!0}pin(e,t=2){let n=Mn(e,this.origin),r=Pn(n);this.pinCenter=r,this.pinned=[];for(let e=-t;e<=t;e++){let i=r.y+e;if(i<0||i>=3e4)continue;let a=Pn({lat:-90+(i+.5)*Dn,lon:n.lon}),o=Nn(i);for(let e=-t;e<=t;e++)this.pinned.push({x:(a.x+e+o)%o,y:i})}this.request(e)}request(e){let t=Mn(e,this.origin),n=Pn(t);this.pinCenter&&(Math.abs(this.pinCenter.y-n.y)>4||Math.abs(this.pinCenter.x-n.x)>4)&&(this.pinCenter=null,this.pinned=[]),this.wanted=[];let r=new Set;for(let t of[-2,2])for(let n of[-2,2]){let i=Pn(Mn({x:e.x+t,z:e.z+n},this.origin));r.add(`${i.x}:${i.y}`)}for(let e=-1;e<=1;e++){let r=n.y+e;if(r<0||r>=3e4)continue;let i=Pn({lat:-90+(r+.5)*Dn,lon:t.lon}),a=Nn(r);for(let e=-1;e<=1;e++){let t=(i.x+e+a)%a;this.wanted.some(e=>e.x===t&&e.y===r)||this.wanted.push({x:t,y:r})}}for(let e of this.pinned)this.wanted.some(t=>t.x===e.x&&t.y===e.y)||this.wanted.push(e);let i=t=>{let n=Fn(t.x,t.y),r=jn({lat:(n.south+n.north)/2,lon:(n.west+n.east)/2},this.origin);return Math.hypot(r.x-e.x,r.z-e.z)};this.wanted.sort((e,t)=>Number(r.has(`${t.x}:${t.y}`))-Number(r.has(`${e.x}:${e.y}`))||i(e)-i(t));let a=new Set(this.wanted.map(e=>`${e.x}:${e.y}`));for(let e of this.tiles.keys())a.has(e)||this.tiles.delete(e);this.loading||this.pump()}async load(e){for(this.request(e);this.loading;)await new Promise(e=>setTimeout(e,50));for(let t=0;t<9&&!this.contains(e)&&!this.error;t++)await this.pump();if(!this.contains(e))throw Error(this.error||`Mapa niedostępna`)}retry(){this.failures.clear(),this.error=``,this.pump()}next(){return this.wanted.find(e=>!this.tiles.has(`${e.x}:${e.y}`)&&Date.now()-(this.failures.get(`${e.x}:${e.y}`)??0)>6e4)}pending(){return this.wanted.filter(e=>!this.tiles.has(`${e.x}:${e.y}`)&&Date.now()-(this.failures.get(`${e.x}:${e.y}`)??0)>6e4).length}async pump(){if(!this.loading)for(;this.next();)await this.fetchOne(this.next())}async fetchOne(e){this.loading=!0;let t=`${e.x}:${e.y}`,n=this.generation;try{let r;try{r=await Promise.race([Jn(t,Fn(e.x,e.y)),new Promise((e,t)=>setTimeout(()=>t(Error(`Mapa nie odpowiada`)),Gn))])}catch(n){console.warn(`World map tile failed, trying Overpass`,n);let i=r={v:2,key:t,elements:await Yn(Fn(e.x,e.y),()=>{let e=Math.max(0,3e3-(Date.now()-this.lastRequest));return this.lastRequest=Date.now()+e,e}),savedAt:Date.now()};Vn(()=>void wn(i))}await Bn();let i=()=>n===this.generation&&this.wanted.some(e=>`${e.x}:${e.y}`===t);if(i()){let e=this.tileData(t,r);this.tiles.set(t,r),this.changed=!0,this.error=``,await Bn(),i()&&this.onTile?.(e)}}catch(e){this.failures.set(t,Date.now()),this.error=e instanceof Error?e.message:`Brak połączenia`}finally{this.loading=!1}}converted=new Map;onTile;tileData(e,t){let n=this.converted.get(e);return n&&n.tile===t||this.converted.set(e,n={tile:t,data:Rn(t.elements,this.origin)}),n.data}snapshot(){let e={origin:this.origin,scale:En,radius:1/0,buildings:[],roads:[],areas:[]};for(let e of this.converted.keys())this.tiles.has(e)||this.converted.delete(e);for(let t of[`buildings`,`roads`,`areas`]){let n=new Set,r=e[t];for(let[e,i]of this.tiles)for(let a of this.tileData(e,i)[t]){if(a.id!==void 0){if(n.has(a.id))continue;n.add(a.id)}r.push(a)}}if(this.seed){let t=this.seed,n=e=>e.length&&e.every(e=>Math.abs(e[0])<t.radius&&Math.abs(e[1])<t.radius);e.buildings=e.buildings.filter(e=>!n(e.rings[0])),e.roads=e.roads.filter(e=>!n(e.pts)),e.areas=e.areas.filter(e=>!n(e.rings[0])),e.buildings.unshift(...t.buildings),e.roads.unshift(...t.roads),e.areas.unshift(...t.areas)}return this.changed=!1,e}rebase(e){this.origin=e,this.seed=void 0,this.generation++,this.converted.clear(),this.changed=!0}};function Zn(e,t){let n=n=>t(n)&&!e.buildings.some(e=>h(n,3.6,e.rings))&&!e.areas.some(e=>e.water&&h(n,3.6,e.rings));if(n({x:0,z:0}))return{x:0,z:0};for(let e=1;e<=35;e+=1)for(let t=0;t<Math.PI*2;t+=.25){let r={x:Math.sin(t)*e,z:Math.cos(t)*e};if(n(r))return r}throw Error(`Brak miejsca na obóz w tym miejscu`)}function Qn(e){let t=38e-5,n=Math.floor((e.lat+90)/t),r=[];for(let i=Math.max(0,n-8);i<=Math.min(473684,n+8);i++){let n=-90+(i+.5)*t,a=Math.max(1,Math.ceil(360*Math.max(1e-5,Math.cos(n*Math.PI/180))/t)),o=360/a,s=Math.floor((An(e.lon)+180)/o);for(let e=-8;e<=8;e++){let n=(s+e+a)%a,c=`v2:${n}:${i}`;if(r.some(e=>e.key===c))continue;let l=In(c);r.push({key:c,seed:l,geo:{lat:-90+(i+.2+l%61/100)*t,lon:An(-180+(n+.2+(l>>>8)%61/100)*o)}})}}return r}var $n={fireball:{name:`Kula ognia`,cooldown:6,text:`pocisk wybuchający przy trafieniu`,element:`fire`},meteor:{name:`Meteor`,cooldown:9,text:`po chwili spada z nieba, rani mocno i podpala w kręgu`,element:`fire`},blizzard:{name:`Zamieć`,cooldown:9,text:`lodowy deszcz rani i spowalnia wszystkich w kręgu`,element:`frost`},flameCone:{name:`Stożek ognia`,cooldown:6,text:`płomień przed sobą rani i podpala`,element:`fire`},chainLightning:{name:`Łańcuch piorunów`,cooldown:7,text:`piorun skacze po pięciu wrogach i ogłusza`,element:`storm`},frostNova:{name:`Fala mrozu`,cooldown:9,text:`lód wokół maga rani i zamraża`,element:`frost`},heal:{name:`Leczenie`,cooldown:6,text:`leczy całą drużynę w pobliżu`,element:`life`},renewal:{name:`Krąg odnowy`,cooldown:10,text:`krąg na ziemi leczy przez kilka sekund każdego w środku`,element:`life`},petals:{name:`Deszcz płatków`,cooldown:9,text:`płatki leczą całą drużynę, ranni zyskują więcej`,element:`life`},bark:{name:`Kora`,cooldown:9,text:`leczy najbardziej rannego i osłania go korą przed ciosami`,element:`life`}},er=[`fireball`,`meteor`,`blizzard`,`flameCone`,`chainLightning`,`frostNova`],tr=[`heal`,`renewal`,`petals`,`bark`],nr={fire:16747069,frost:10478847,storm:16773754,life:10351258};function rr(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return t>>>0}function ir(e){let t=e.role===`mage`?er:e.role===`herbalist`?tr:[];return t.length?e.spell&&t.includes(e.spell)?e.spell:t[rr(e.id)%t.length]:null}function ar(e){let t=ir(e);return t?$n[t].element:null}var or={slots:24,safeRadius:7.5,minCampDistance:90,ropeLength:216,ropeSafeMeters:10,quietBorderMeters:300,recruitmentMs:3e5,campWood:20,ropePerFiber:25,startStock:{wood:40,ore:0,fiber:10,herbs:0,rope:2500}},sr=[`wood`,`ore`,`fiber`,`herbs`,`rope`],cr={wood:`Drewno`,ore:`Ruda`,fiber:`Włókno`,herbs:`Zioła`,rope:`Lina`};function lr(e,t){return Math.min(or.ropeLength,e.stock.rope*t)}function ur(e,t,n){let r=Math.ceil(t/n);return r>e.stock.rope?!1:(e.stock.rope-=r,!0)}var dr=[`wood`,`ore`,`fiber`,`herbs`,`rope`];function fr(e,t){let n=e.rates,r=e.pending??={},i=e.producedAt??t;if(e.producedAt=t,!n||t<=i)return!1;let a=Math.min(10,(t-i)/36e5),o=!0,s=!0,c=!1;for(let t of dr){let i=n[t]??0,l=i*10;if(l<=0)continue;c=!0;let u=r[t]??0;u<l-1e-9&&(s=!1);let d=Math.min(l-u,i*a);t===`rope`&&(d=Math.max(0,Math.min(d,e.stock.fiber*or.ropePerFiber)),e.stock.fiber-=Math.ceil(d/or.ropePerFiber-1e-9),e.stock.fiber=Math.max(0,e.stock.fiber)),r[t]=u+Math.max(0,d),r[t]<l-1e-9&&(o=!1)}return c&&o&&!s}function pr(e){let t={wood:0,ore:0,fiber:0,herbs:0,rope:0};if(!e.pending)return t;for(let n of dr){let r=Math.floor(e.pending[n]??0);r&&(e.pending[n]=(e.pending[n]??0)-r,e.stock[n]+=r,t[n]=r)}return t}function mr(e,t){let n=Math.min(Math.floor(t),e.stock.fiber);return n<=0?0:(e.stock.fiber-=n,e.stock.rope+=n*or.ropePerFiber,n*or.ropePerFiber)}var hr=[`warrior`,`mage`,`archer`,`herbalist`,`woodcutter`,`miner`,`ropemaker`],gr=[`woodcutter`,`miner`,`ropemaker`],_r=e=>gr.includes(e),vr=[`weapon`,`offhand`,`armor`,`helmet`,`boots`],yr=e=>e.count??1,br=(e,t)=>e.slot===`material`&&t.slot===`material`&&e.kind===t.kind&&(e.level??1)===(t.level??1);function xr(e,t,n=1/0){let r=e.find(e=>e!==t&&br(e,t));return r?(r.count=yr(r)+yr(t),!0):e.length>=n?!1:(e.push(t),!0)}function Sr(e){let t=[];for(let n of e)xr(t,n);return t}var Cr=[`weapon`,`offhand`,`armor`,`helmet`,`boots`,`material`],wr=[`legendary`,`epic`,`rare`,`uncommon`,`common`];function Tr(e){return e.sort((e,t)=>Cr.indexOf(e.slot)-Cr.indexOf(t.slot)||wr.indexOf(e.rarity??`common`)-wr.indexOf(t.rarity??`common`)||t.power-e.power||e.name.localeCompare(t.name,`pl`)),e}var Er=e=>e.potions??0,Dr=[10,20,30,60,90,120,180,240,300],Or=e=>({warrior:`Wojownik`,mage:`Mag`,archer:`Łucznik`,herbalist:`Zielarz`,woodcutter:`Drwal`,miner:`Górnik`,ropemaker:`Powroźnik`})[e];function kr(e){let t=Math.max(0,e-1);return Math.round(240*t+85*t*t+12*t*t*t)}function Ar(e){let t=1;for(;t<100&&e>=kr(t+1);)t++;return t}function jr(e){let t=Ar(e);return(e-kr(t))/(kr(t+1)-kr(t))}function Mr(e){let t=kr(Ar(e));return t+Math.floor((e-t)*.9)}function Nr(e){return 100+(Ar(e.exp)-1)*8+(e.equipment.armor?.power??0)*2}function Pr(e){return Ar(e.exp)-1+(e.equipment.weapon?.power??0)}function Fr(e){return[`offhand`,`armor`,`helmet`,`boots`].reduce((t,n)=>t+(e.equipment[n]?.power??0),0)}function Ir(e,t){return`${t}-${++e.serial}`}var Lr=[[`Miecz podróżny`,`weapon`,4,140,`sword`],[`Kostur`,`weapon`,4,140,`staff`],[`Kurtka wędrowca`,`armor`,5,110,`armor`],[`Skórzany hełm`,`helmet`,2,60,`helmet`],[`Buty wędrowca`,`boots`,2,60,`boots`],[`Miecz strażnika`,`weapon`,7,260,`sword`],[`Kostur bursztynowy`,`weapon`,7,260,`staff`],[`Drewniana tarcza`,`offhand`,2,70,`shield`],[`Kryształowy orb`,`offhand`,2,70,`orb`],[`Topór`,`weapon`,5,180,`axe`],[`Młot`,`weapon`,6,220,`hammer`]],Rr=Lr.length,zr={skora:[`Skóra`,`hide`,8],kiel:[`Kieł`,`fang`,12]};function Br(e,t,n=1){let[r,i,a]=zr[t];return{id:Ir(e,`item`),kind:`mat-${t}`,name:r,slot:`material`,level:n,rarity:`common`,power:0,value:a*n,icon:i}}function Vr(e,t,n=1,r=`common`){let[o,s,c,l,u]=Lr[Math.abs(t)%Lr.length];return{id:Ir(e,`item`),kind:`gear-${t%Lr.length}`,name:o,slot:s,level:n,rarity:r,affinity:u===`sword`||u===`shield`||u===`axe`||u===`hammer`?`warrior`:u===`staff`||u===`orb`?`mage`:void 0,power:c+Math.max(0,n-1)+i[r],value:l*n*a[r],icon:u}}function Hr(e,t){let n={...e,id:`hero-1`,name:`Wędrowiec`,role:`warrior`,appearance:0,exp:0,hp:100,coins:40,kills:0,fragments:0,campId:`camp-1`,bag:[],equipment:{},weapon:`sword`,potions:3},r={v:2,origin:t,activeId:n.id,characters:[n],camps:[{...e,id:`camp-1`,route:[],buildings:0}],vault:[],bank:0,stock:{...or.startStock},longRope:!0,offers:[],encounters:{},serial:1};return n.bag.push(Vr(r,0),Vr(r,1),Vr(r,2)),r}function Ur(e){let t=[e.activeId,...(e.party??[]).filter(t=>t!==e.activeId)].filter((t,n,r)=>r.indexOf(t)===n&&e.characters.some(n=>n.id===t&&(t===e.activeId||!_r(n.role)))).slice(0,3);return e.party=t,t}function Wr(e,t){let n=Ur(e);if(t===e.activeId)return!1;let r=e.characters.find(e=>e.id===t);if(!r||_r(r.role))return!1;if(n.includes(t))e.party=n.filter(e=>e!==t);else if(n.length<3)e.party=[...n,t];else return!1;return!0}function Gr(e){return e.characters.find(t=>t.id===e.activeId)}function Kr(e,t,n=or.safeRadius){return e.camps.filter(e=>u(e,t)<=n).sort((e,n)=>u(e,t)-u(n,t))[0]}function qr(e,t,n){return re(e,t,n,or.safeRadius,or.ropeSafeMeters)}function Jr(e,t,n,r=0){return qr(e,t,n)<=r}function Yr(e,t,n,r){let i=e.camps.find(e=>e.id===t),a=e.camps.find(e=>e.id===n);return!i||!a||i===a||r.length<2||r.some(e=>!Number.isFinite(e.x)||!Number.isFinite(e.z))||u(r[0],i)>.01||u(r.at(-1),a)>.01||e.camps.some(e=>e.id===n&&e.parentId===t||e.id===t&&e.parentId===n)||e.connections?.some(e=>e.from===t&&e.to===n||e.from===n&&e.to===t)?!1:(e.connections??=[],e.connections.push({id:Ir(e,`link`),from:t,to:n,route:r.map(e=>({...e}))}),ee(e),!0)}function Xr(e,t){let n=e.bag.findIndex(e=>e.id===t);if(n<0||e.bag[n].slot===`material`)return!1;let r=e.bag[n],i=e.equipment[r.slot];return e.bag.splice(n,1),i&&e.bag.push(i),e.equipment[r.slot]=r,r.slot===`weapon`&&(e.weapon=r.icon===`staff`?`magic`:`sword`),e.hp=Math.min(e.hp,Nr(e)),!0}function Zr(e,t){let n=e.equipment[t];return!n||e.bag.length>=or.slots?!1:(delete e.equipment[t],e.bag.push(n),t===`weapon`&&(e.weapon=e.role===`warrior`?`sword`:`magic`),e.hp=Math.min(e.hp,Nr(e)),!0)}function Qr(e,t){if(t.slot===`material`)return null;let n=e.equipment[t.slot];return n?.id===t.id?null:{worn:n,delta:t.power-(n?.power??0)}}function $r(e,t,n,r=1/0){let i=e.findIndex(e=>e.id===n);return i<0||!xr(t,e[i],r)?!1:(e.splice(i,1),!0)}function ei(e,t,n,r,i=Date.now()){let a=Gr(e);if(!e.camps.some(e=>e.id===t)||e.offers.length>0||!Number.isSafeInteger(n)||n<0||n>a.coins||new Set(r).size!==r.length||r.some(e=>!a.bag.some(t=>t.id===e))||!n&&!r.length)return null;let o=r.map(e=>a.bag.find(t=>t.id===e));a.bag=a.bag.filter(e=>!r.includes(e.id)),a.coins-=n;let s={id:Ir(e,`offer`),campId:t,gold:n,items:o,readyAt:i+or.recruitmentMs,seed:e.serial*7919,ceiling:Ar(a.exp),candidates:null};return e.offers.push(s),s}function ti(e,t=Date.now()){return e.candidates?e.candidates:(e.pool??[]).filter(e=>e.at<=t).map(({at:e,...t})=>t)}function ni(e,t=Date.now()){let n=!1;for(let r of e.offers){if(r.candidates)continue;if(!r.pool){let t=e.camps.find(e=>e.id===r.campId),n=t?Mn(t,e.origin):e.origin,i=xe(r,t?.buildings??0,de(n.lat,n.lon),new Set(e.characters.map(e=>e.name))),a=r.seed^1540483477,o=()=>(a=Math.imul(a,1664525)+1013904223|0,(a>>>0)/4294967296),s=r.readyAt-or.recruitmentMs;r.pool=i.map(e=>({...e,at:s+Dr[Math.floor(o()*Dr.length)]*1e3})).sort((e,t)=>e.at-t.at),r.arrived=0}let i=r.pool.filter(e=>e.at<=t).length;i>(r.arrived??0)&&(r.arrived=i,n=!0),t>=r.readyAt&&(r.candidates=r.pool.map(({at:e,...t})=>t),delete r.pool,delete r.arrived,n=!0)}return n}function ri(e,t,n,r){let i={x:n.x,z:n.z,id:Ir(e,`hero`),name:t.name,role:t.role,appearance:t.appearance,sex:t.sex,rarity:t.rarity,trait:t.trait,title:t.title,region:t.region,exp:kr(t.level),hp:100+(t.level-1)*8,coins:0,kills:0,fragments:0,campId:r,bag:[],equipment:{},weapon:t.role===`warrior`?`sword`:`magic`,potions:1,spell:ir(t)??void 0};return i.equipment.weapon=Vr(e,t.role===`warrior`?0:1),e.characters.push(i),i}function ii(e,t,n,r,i=Date.now()){let a=e.offers.find(e=>e.id===t),o=a&&ti(a,i).find(e=>e.id===n),s=e.camps.find(e=>e.id===r)??e.camps.find(e=>e.id===a?.campId);if(!a||!o||!s)return null;let c=ri(e,o,s,s.id);return e.offers=e.offers.filter(e=>e!==a),c}function ai(e,t){return e.offers.find(e=>e.campId===t)??e.offers[0]}function oi(e,t){let n=e.offers.find(e=>e.id===t);return n?(e.bank+=n.gold,e.vault.push(...n.items),e.offers=e.offers.filter(e=>e!==n),!0):!1}function si(e){try{let t=JSON.parse(e);if(t.v!==2||!Array.isArray(t.characters)||!t.characters.length||!Array.isArray(t.camps)||!t.camps.length||!Array.isArray(t.vault)||!Array.isArray(t.offers)||!Number.isSafeInteger(t.serial)||t.serial<1||!Number.isFinite(t.bank)||t.bank<0||!Number.isFinite(t.origin?.lat)||Math.abs(t.origin.lat)>90||!Number.isFinite(t.origin.lon)||Math.abs(t.origin.lon)>180||(t.connections??=[],!Array.isArray(t.connections))||(t.stock={...or.startStock,...t.stock??{}},t.longRope||=(t.stock.rope=Math.max(t.stock.rope,or.startStock.rope),!0),sr.some(e=>!Number.isFinite(t.stock[e])||t.stock[e]<0)))return null;for(let e of[`rates`,`pending`]){let n=t[e];if(n!==void 0&&(typeof n!=`object`||dr.some(e=>n[e]!==void 0&&(!Number.isFinite(n[e])||n[e]<0))))return null}if(t.producedAt!==void 0&&!Number.isFinite(t.producedAt)||t.party!==void 0&&(!Array.isArray(t.party)||t.party.some(e=>typeof e!=`string`))||(t.explored??=[],!Array.isArray(t.explored)||t.explored.some(e=>typeof e!=`string`))||(t.rescued??={},typeof t.rescued!=`object`||Array.isArray(t.rescued)||Object.values(t.rescued).some(e=>!Number.isFinite(e)))||(t.vents??={},typeof t.vents!=`object`||Array.isArray(t.vents)||Object.values(t.vents).some(e=>!Number.isFinite(e)))||(t.harvested??={},typeof t.harvested!=`object`||Array.isArray(t.harvested)||Object.values(t.harvested).some(e=>!Number.isFinite(e)))||(t.encounters??={},typeof t.encounters!=`object`||Array.isArray(t.encounters)||Object.values(t.encounters).some(e=>!Number.isFinite(e))))return null;let n=new Set,r=new Set,i=e=>{if(!e||typeof e.id!=`string`||r.has(e.id)||![...vr,`material`].includes(e.slot)||!Number.isFinite(e.power)||e.power<0||!Number.isFinite(e.value)||e.value<0||typeof e.name!=`string`||e.level!==void 0&&(!Number.isInteger(e.level)||e.level<1||e.level>100)||e.rarity!==void 0&&![`common`,`uncommon`,`rare`,`epic`,`legendary`].includes(e.rarity)||e.affinity!==void 0&&!hr.includes(e.affinity)||e.count!==void 0&&(!Number.isSafeInteger(e.count)||e.count<1))throw Error();r.add(e.id)},a=e=>Number.isFinite(e.x)&&Number.isFinite(e.z);for(let e of t.camps){if(!a(e)||typeof e.id!=`string`||n.has(e.id)||!Array.isArray(e.route)||!e.route.every(a)||!Number.isFinite(e.buildings))return null;n.add(e.id)}for(let e of t.camps)if(e.parentId&&!n.has(e.parentId))return null;for(let e of t.connections){let r=t.camps.find(t=>t.id===e.from),i=t.camps.find(t=>t.id===e.to);if(typeof e.id!=`string`||n.has(e.id)||!r||!i||r===i||!Array.isArray(e.route)||e.route.length<2||!e.route.every(a)||u(e.route[0],r)>.01||u(e.route.at(-1),i)>.01)return null;n.add(e.id)}for(let e of t.characters){if(!a(e)||n.has(e.id)||!t.camps.some(t=>t.id===e.campId)||!hr.includes(e.role)||typeof e.name!=`string`||!Number.isFinite(e.appearance)||![e.exp,e.hp,e.coins,e.kills,e.fragments].every(e=>Number.isFinite(e)&&e>=0)||!Array.isArray(e.bag)||e.bag.length>or.slots||!e.equipment||e.rarity!==void 0&&![`common`,`rare`,`epic`,`legendary`].includes(e.rarity)||e.sex!==void 0&&![`m`,`f`].includes(e.sex)||[e.trait,e.title,e.region].some(e=>e!==void 0&&typeof e!=`string`)||(n.add(e.id),e.potions??=3,!Number.isSafeInteger(e.potions)||e.potions<0)||e.spell!==void 0&&typeof e.spell!=`string`)return null;e.bag.forEach(i),e.bag=Sr(e.bag),Object.entries(e.equipment).forEach(([e,t])=>{if(t.slot!==e||t.slot===`material`)throw Error();i(t)})}t.vault.forEach(i),t.vault=Sr(t.vault);for(let e of t.offers){if(!n.has(e.campId)||!Number.isSafeInteger(e.gold)||e.gold<0||!Number.isFinite(e.readyAt)||!Number.isFinite(e.seed)||!Number.isFinite(e.ceiling)||!Array.isArray(e.items))return null;e.items.forEach(i);let t=e=>!hr.includes(e.role)||!Number.isInteger(e.level)||e.level<1||e.level>100;if(e.candidates!==null&&(!Array.isArray(e.candidates)||e.candidates.some(t))||e.pool!==void 0&&(!Array.isArray(e.pool)||e.pool.some(e=>t(e)||!Number.isFinite(e.at))))return null}return t.characters.some(e=>e.id===t.activeId)?t:null}catch{return null}}var ci=[`wood`,`ore`,`fiber`,`herbs`],li={wood:3,ore:2,fiber:4,herbs:2},ui={wood:[`drewna`,`Pień`],ore:[`rudy`,`Skałka`],fiber:[`włókna`,`Kępa traw`],herbs:[`ziół`,`Zioła`]},di=6e5,fi=22e-5,pi={forest:[`wood`,`wood`,`herbs`],wood:[`wood`,`wood`,`herbs`],scrub:[`wood`,`herbs`],orchard:[`wood`,`herbs`],park:[`wood`,`herbs`,`fiber`],green:[`fiber`,`herbs`,`wood`],garden:[`herbs`,`fiber`],grass:[`fiber`],meadow:[`fiber`,`fiber`,`herbs`],grassland:[`fiber`,`herbs`],village_green:[`fiber`],farmland:[`fiber`,`fiber`,`herbs`],allotments:[`herbs`,`fiber`],cemetery:[`herbs`],quarry:[`ore`],industrial:[`ore`],construction:[`ore`],railway:[`ore`],brownfield:[`ore`,`fiber`],landfill:[`ore`]};function mi(e){return e?pi[e]??null:null}var hi=new WeakMap;function gi(e){let t=hi.get(e);if(!t){t=[1/0,1/0,-1/0,-1/0];for(let[n,r]of e)n<t[0]&&(t[0]=n),r<t[1]&&(t[1]=r),n>t[2]&&(t[2]=n),r>t[3]&&(t[3]=r);hi.set(e,t)}return t}function _i(e,t){let n=!1;for(let r=0,i=t.length-1;r<t.length;i=r++){let a=t[r],o=t[i];a[1]>e.z!=o[1]>e.z&&e.x<(o[0]-a[0])*(e.z-a[1])/(o[1]-a[1])+a[0]&&(n=!n)}return n}var vi=8,yi=new WeakMap,bi=(e,t)=>(Math.floor(e/vi)+32768)*65536+Math.floor(t/vi)+32768;function xi(e){let t=yi.get(e);if(t)return t;t=new Map;for(let n=0;n<e.areas.length;n++){if(e.areas[n].water)continue;let r=gi(e.areas[n].rings[0]);for(let e=Math.floor(r[0]/vi);e<=Math.floor(r[2]/vi);e++)for(let i=Math.floor(r[1]/vi);i<=Math.floor(r[3]/vi);i++){let r=bi(e*vi,i*vi),a=t.get(r);a?a.push(n):t.set(r,[n])}}return yi.set(e,t),t}function Si(e,t){let n=xi(e).get(bi(t.x,t.z));if(!n)return null;for(let r=n.length-1;r>=0;r--){let i=e.areas[n[r]],a=i.rings[0],o=gi(a);if(!(t.x<o[0]||t.x>o[2]||t.z<o[1]||t.z>o[3])&&_i(t,a)&&!i.rings.slice(1).some(e=>_i(t,e)))return i.kind??`green`}return null}function Ci(e,t,n,r,i,a){let o=[],s=i/(111320*e.scale)+fi,c=Math.floor((n.lat-s+90)/fi),l=Math.floor((n.lat+s+90)/fi);for(let s=c;s<=l;s++){let c=-90+(s+.5)*fi,l=Math.max(1e-5,Math.cos(c*Math.PI/180)),d=Math.max(1,Math.ceil(360*l/fi)),f=360/d,p=i/(111320*l*e.scale)+f,m=Math.floor((An(n.lon-p)+180)/f),h=Math.ceil(2*p/f);for(let n=0;n<=h;n++){let c=(m+n)%d,l=`r1:${c}:${s}`,p=In(l),h=jn({lat:-90+(s+.15+p%71/100)*fi,lon:An(-180+(c+.15+(p>>>8)%71/100)*f)},t);if(u(h,r)>i)continue;let g=(p>>>16)%1e3/1e3,_=mi(Si(e,h)),v=null;_&&g<.45?v=_[(p>>>4)%_.length]:g<.04&&(v=ci[(p>>>5)%ci.length]),v&&a(h)&&o.push({key:l,kind:v,x:h.x,z:h.z,primary:!!_})}}return o}function wi(e,t){let n=[];return ci.forEach((r,i)=>{for(let a=9;a<=24;a+=1.5)for(let o=0;o<12;o++){let s=(i*90+25+o*30)*Math.PI/180,c={x:e.x+Math.sin(s)*a,z:e.z+Math.cos(s)*a};if(t(c)&&n.every(e=>u(e,c)>3)){n.push({key:`start:${r}`,kind:r,x:c.x,z:c.z,primary:!1});return}}}),n}var Ti=.6,Ei=.1,Di=()=>({wood:0,ore:0,fiber:0,herbs:0});function Oi(e,t,n){let r=Di();for(let i of e){let e=1/0,a=1/0,o=-1/0,s=-1/0;for(let t of i)e=Math.min(e,t.x),a=Math.min(a,t.z),o=Math.max(o,t.x),s=Math.max(s,t.z);for(let c=Math.floor(e/4)*4+2;c<o;c+=4)for(let e=Math.floor(a/4)*4+2;e<s;e+=4){let a={x:c,z:e};if(!ne(a,i))continue;if(!n(a))return null;let o=mi(Si(t,a));if(o)for(let e of o)r[e]+=Ti/o.length;else for(let e of ci)r[e]+=Ti*Ei/4}}return r}var ki={woodcutter:{good:`wood`,base:2,kinds:[`forest`,`wood`,`scrub`,`orchard`,`park`]},miner:{good:`ore`,base:1.5,kinds:[`quarry`,`industrial`,`construction`,`railway`,`brownfield`,`landfill`]},ropemaker:{good:`rope`,base:50,kinds:[]}},Ai={common:.5,rare:1,epic:1.5,legendary:1.5};function ji(e,t,n){if(!t.length)return 1;let r=0,i=0;for(let a=-20;a<=20;a+=5)for(let o=-20;o<=20;o+=5)a*a+o*o>400||(i++,t.includes(Si(n,{x:e.x+a,z:e.z+o})??``)&&r++);return i?r/i:0}function Mi(e,t){let n={};for(let r of e){let e=ki[r.role];if(!e)continue;let i=ji(r.at,e.kinds,t),a=r.trait===`master`?2:r.trait===`diligent`?1+.2*(Ai[r.rarity??`common`]??.5):1,o=e.base*(e.kinds.length?.4+1.6*i:1)*(1+.05*(r.level-1))*a;n[e.good]=(n[e.good]??0)+o}return n}var Ni={...$n,sweep:{name:`Cięcie`,cooldown:6,text:`szerokie cięcie przed sobą`},charge:{name:`Szarża`,cooldown:6,text:`pęd naprzód, rani i odrzuca wszystkich na drodze`},whirl:{name:`Wir`,cooldown:7,text:`obrót z bronią, rani wszystkich dookoła`},quake:{name:`Wstrząs`,cooldown:8,text:`uderzenie w ziemię, rani i ogłusza w kręgu`},volley:{name:`Salwa`,cooldown:6,text:`pięć pocisków wachlarzem przed siebie`},taunt:{name:`Prowokacja`,cooldown:12,text:`wrogowie atakują Ciebie, a Ty przyjmujesz mniej`},manaShield:{name:`Tarcza many`,cooldown:14,text:`pochłania kolejne ciosy`}};function Pi(e){if(e.role===`archer`)return`volley`;let t=ir(e);if(t&&(e.role===`herbalist`||!e.equipment.weapon||e.equipment.weapon.icon===`staff`))return t;switch(e.equipment.weapon?.icon){case`sword`:return`charge`;case`axe`:return`whirl`;case`hammer`:return`quake`;case`staff`:return`fireball`;default:return`sweep`}}function Fi(e){let t=e.equipment.weapon?.icon;return t?t===`staff`?`magic`:`sword`:e.role===`warrior`?`sword`:`magic`}function Ii(e){switch(e.equipment.offhand?.icon){case`shield`:return`taunt`;case`orb`:return`manaShield`;default:return null}}var Li=1e3,Ri=1001,zi=1002,Bi=1003,Vi=1004,Hi=1005,Ui=1006,Wi=1007,Gi=1008,Ki=1009,qi=1010,Ji=1011,Yi=1012,Xi=1013,Zi=1014,Qi=1015,$i=1016,ea=1017,ta=1018,na=1020,ra=35902,ia=35899,aa=1021,oa=1022,sa=1023,ca=1026,la=1027,ua=1028,da=1029,fa=1030,pa=1031,ma=1033,ha=33776,ga=33777,_a=33778,va=33779,ya=35840,ba=35841,xa=35842,Sa=35843,Ca=36196,wa=37492,Ta=37496,Ea=37488,Da=37489,Oa=37490,ka=37491,Aa=37808,ja=37809,Ma=37810,Na=37811,Pa=37812,Fa=37813,Ia=37814,La=37815,Ra=37816,za=37817,Ba=37818,Va=37819,Ha=37820,Ua=37821,Wa=36492,Ga=36494,Ka=36495,qa=36283,Ja=36284,Ya=36285,Xa=36286,Za=2300,Qa=2301,$a=2302,eo=2303,to=2400,no=2401,ro=2402,io=3200,ao=`srgb`,oo=`srgb-linear`,so=`linear`,co=`srgb`,lo=7680,uo=35044,fo=2e3;function po(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function mo(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function ho(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function go(){let e=ho(`canvas`);return e.style.display=`block`,e}var _o={};function vo(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function yo(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function R(...e){e=yo(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function z(...e){e=yo(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function bo(...e){let t=e.join(` `);t in _o||(_o[t]=!0,R(...e))}function xo(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var So={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Co=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},wo=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),To=Math.PI/180,Eo=180/Math.PI;function Do(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(wo[e&255]+wo[e>>8&255]+wo[e>>16&255]+wo[e>>24&255]+`-`+wo[t&255]+wo[t>>8&255]+`-`+wo[t>>16&15|64]+wo[t>>24&255]+`-`+wo[n&63|128]+wo[n>>8&255]+`-`+wo[n>>16&255]+wo[n>>24&255]+wo[r&255]+wo[r>>8&255]+wo[r>>16&255]+wo[r>>24&255]).toLowerCase()}function Oo(e,t,n){return Math.max(t,Math.min(n,e))}function ko(e,t){return(e%t+t)%t}function Ao(e,t,n){return(1-n)*e+n*t}function jo(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Mo(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var B=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Oo(this.x,e.x,t.x),this.y=Oo(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Oo(this.x,e,t),this.y=Oo(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oo(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oo(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},No=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:R(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Oo(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fo.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Oo(this.x,e.x,t.x),this.y=Oo(this.y,e.y,t.y),this.z=Oo(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Oo(this.x,e,t),this.y=Oo(this.y,e,t),this.z=Oo(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oo(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Po.copy(this).projectOnVector(e),this.sub(Po)}reflect(e){return this.sub(Po.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oo(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Po=new V,Fo=new No,Io=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return bo(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lo.makeScale(e,t)),this}rotate(e){return bo(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lo.makeRotation(-e)),this}translate(e,t){return bo(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lo=new Io,Ro=new Io().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zo=new Io().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bo(){let e={enabled:!0,workingColorSpace:oo,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ho(e.r),e.g=Ho(e.g),e.b=Ho(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Uo(e.r),e.g=Uo(e.g),e.b=Uo(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?so:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return bo(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return bo(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[oo]:{primaries:t,whitePoint:r,transfer:so,toXYZ:Ro,fromXYZ:zo,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:ao},outputColorSpaceConfig:{drawingBufferColorSpace:ao}},[ao]:{primaries:t,whitePoint:r,transfer:co,toXYZ:Ro,fromXYZ:zo,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:ao}}}),e}var Vo=Bo();function Ho(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Uo(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wo,Go=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wo===void 0&&(Wo=ho(`canvas`)),Wo.width=e.width,Wo.height=e.height;let t=Wo.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wo}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=ho(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ho(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ho(t[e]/255)*255):t[e]=Ho(t[e]);return{data:t,width:e.width,height:e.height}}return R(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ko=0,qo=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ko++}),this.uuid=Do(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jo(r[t].image)):e.push(Jo(r[t]))}else e=Jo(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jo(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Go.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(R(`Texture: Unable to serialize Texture.`),{})}var Yo=0,Xo=new V,Zo=class e extends Co{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=Ri,i=Ri,a=Ui,o=Gi,s=sa,c=Ki,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yo++}),this.uuid=Do(),this.name=``,this.source=new qo(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Io,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xo).x}get height(){return this.source.getSize(Xo).y}get depth(){return this.source.getSize(Xo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){R(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?R(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Li:e.x-=Math.floor(e.x);break;case Ri:e.x=e.x<0?0:1;break;case zi:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Li:e.y-=Math.floor(e.y);break;case Ri:e.y=e.y<0?0:1;break;case zi:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zo.DEFAULT_IMAGE=null,Zo.DEFAULT_MAPPING=300,Zo.DEFAULT_ANISOTROPY=1;var Qo=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Oo(this.x,e.x,t.x),this.y=Oo(this.y,e.y,t.y),this.z=Oo(this.z,e.z,t.z),this.w=Oo(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Oo(this.x,e,t),this.y=Oo(this.y,e,t),this.z=Oo(this.z,e,t),this.w=Oo(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oo(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$o=class extends Co{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ui,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qo(0,0,e,t),this.scissorTest=!1,this.viewport=new Qo(0,0,e,t),this.textures=[];let r=new Zo({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ui,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qo(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},es=class extends $o{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ts=class extends Zo{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Bi,this.minFilter=Bi,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},ns=class extends Zo{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Bi,this.minFilter=Bi,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},rs=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/is.setFromMatrixColumn(e,0).length(),i=1/is.setFromMatrixColumn(e,1).length(),a=1/is.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(os,e,ss)}lookAt(e,t,n){let r=this.elements;return us.subVectors(e,t),us.lengthSq()===0&&(us.z=1),us.normalize(),cs.crossVectors(n,us),cs.lengthSq()===0&&(Math.abs(n.z)===1?us.x+=1e-4:us.z+=1e-4,us.normalize(),cs.crossVectors(n,us)),cs.normalize(),ls.crossVectors(us,cs),r[0]=cs.x,r[4]=ls.x,r[8]=us.x,r[1]=cs.y,r[5]=ls.y,r[9]=us.y,r[2]=cs.z,r[6]=ls.z,r[10]=us.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],te=r[7],ne=r[11],re=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*te,i[8]=a*C+o*D+s*j+c*ne,i[12]=a*w+o*O+s*ee+c*re,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*te,i[9]=l*C+u*D+d*j+f*ne,i[13]=l*w+u*O+d*ee+f*re,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*te,i[10]=p*C+m*D+h*j+g*ne,i[14]=p*w+m*O+h*ee+g*re,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*te,i[11]=_*C+v*D+y*j+b*ne,i[15]=_*w+v*O+y*ee+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=is.set(r[0],r[1],r[2]).length(),o=is.set(r[4],r[5],r[6]).length(),s=is.set(r[8],r[9],r[10]).length();i<0&&(a=-a),as.copy(this);let c=1/a,l=1/o,u=1/s;return as.elements[0]*=c,as.elements[1]*=c,as.elements[2]*=c,as.elements[4]*=l,as.elements[5]*=l,as.elements[6]*=l,as.elements[8]*=u,as.elements[9]*=u,as.elements[10]*=u,t.setFromRotationMatrix(as),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=fo,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=fo,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},is=new V,as=new rs,os=new V(0,0,0),ss=new V(1,1,1),cs=new V,ls=new V,us=new V,ds=new rs,fs=new No,ps=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Oo(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Oo(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Oo(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Oo(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Oo(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Oo(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:R(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ds.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ds,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fs.setFromEuler(this),this.setFromQuaternion(fs,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ps.DEFAULT_ORDER=`XYZ`;var ms=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},hs=0,gs=new V,_s=new No,vs=new rs,ys=new V,bs=new V,xs=new V,Ss=new No,Cs=new V(1,0,0),ws=new V(0,1,0),Ts=new V(0,0,1),Es={type:`added`},Ds={type:`removed`},Os={type:`childadded`,child:null},ks={type:`childremoved`,child:null},As=class e extends Co{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hs++}),this.uuid=Do(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new ps,r=new No,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rs},normalMatrix:{value:new Io}}),this.matrix=new rs,this.matrixWorld=new rs,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.multiply(_s),this}rotateOnWorldAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.premultiply(_s),this}rotateX(e){return this.rotateOnAxis(Cs,e)}rotateY(e){return this.rotateOnAxis(ws,e)}rotateZ(e){return this.rotateOnAxis(Ts,e)}translateOnAxis(e,t){return gs.copy(e).applyQuaternion(this.quaternion),this.position.add(gs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cs,e)}translateY(e){return this.translateOnAxis(ws,e)}translateZ(e){return this.translateOnAxis(Ts,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vs.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ys.copy(e):ys.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vs.lookAt(bs,ys,this.up):vs.lookAt(ys,bs,this.up),this.quaternion.setFromRotationMatrix(vs),r&&(vs.extractRotation(r.matrixWorld),_s.setFromRotationMatrix(vs),this.quaternion.premultiply(_s.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(z(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Es),Os.child=e,this.dispatchEvent(Os),Os.child=null):z(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ds),ks.child=e,this.dispatchEvent(ks),ks.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vs.multiply(e.parent.matrixWorld)),e.applyMatrix4(vs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Es),Os.child=e,this.dispatchEvent(Os),Os.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,e,xs),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,Ss,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};As.DEFAULT_UP=new V(0,1,0),As.DEFAULT_MATRIX_AUTO_UPDATE=!0,As.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var H=class extends As{constructor(){super(),this.isGroup=!0,this.type=`Group`}},js={type:`move`},Ms=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new H,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new H,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new H,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(js)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new H;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ns={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ps={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function Is(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var U=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ao){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vo.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vo.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vo.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vo.workingColorSpace){if(e=ko(e,1),t=Oo(t,0,1),n=Oo(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Is(i,r,e+1/3),this.g=Is(i,r,e),this.b=Is(i,r,e-1/3)}return Vo.colorSpaceToWorking(this,r),this}setStyle(e,t=ao){function n(t){t!==void 0&&parseFloat(t)<1&&R(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:R(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);R(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ao){let n=Ns[e.toLowerCase()];return n===void 0?R(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ho(e.r),this.g=Ho(e.g),this.b=Ho(e.b),this}copyLinearToSRGB(e){return this.r=Uo(e.r),this.g=Uo(e.g),this.b=Uo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ao){return Vo.workingToColorSpace(Ls.copy(this),e),Math.round(Oo(Ls.r*255,0,255))*65536+Math.round(Oo(Ls.g*255,0,255))*256+Math.round(Oo(Ls.b*255,0,255))}getHexString(e=ao){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vo.workingColorSpace){Vo.workingToColorSpace(Ls.copy(this),t);let n=Ls.r,r=Ls.g,i=Ls.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vo.workingColorSpace){return Vo.workingToColorSpace(Ls.copy(this),t),e.r=Ls.r,e.g=Ls.g,e.b=Ls.b,e}getStyle(e=ao){Vo.workingToColorSpace(Ls.copy(this),e);let t=Ls.r,n=Ls.g,r=Ls.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Ps),this.setHSL(Ps.h+e,Ps.s+t,Ps.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ps),e.getHSL(Fs);let n=Ao(Ps.h,Fs.h,t),r=Ao(Ps.s,Fs.s,t),i=Ao(Ps.l,Fs.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ls=new U;U.NAMES=Ns;var Rs=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new U(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},zs=class extends As{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ps,this.environmentIntensity=1,this.environmentRotation=new ps,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Bs=new V,Vs=new V,Hs=new V,Us=new V,Ws=new V,Gs=new V,Ks=new V,qs=new V,Js=new V,Ys=new V,Xs=new Qo,Zs=new Qo,Qs=new Qo,$s=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Bs.subVectors(e,t),r.cross(Bs);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Bs.subVectors(r,t),Vs.subVectors(n,t),Hs.subVectors(e,t);let a=Bs.dot(Bs),o=Bs.dot(Vs),s=Bs.dot(Hs),c=Vs.dot(Vs),l=Vs.dot(Hs),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Us)!==null&&Us.x>=0&&Us.y>=0&&Us.x+Us.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Us)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Us.x),s.addScaledVector(a,Us.y),s.addScaledVector(o,Us.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Xs.setScalar(0),Zs.setScalar(0),Qs.setScalar(0),Xs.fromBufferAttribute(e,t),Zs.fromBufferAttribute(e,n),Qs.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Xs,i.x),a.addScaledVector(Zs,i.y),a.addScaledVector(Qs,i.z),a}static isFrontFacing(e,t,n,r){return Bs.subVectors(n,t),Vs.subVectors(e,t),Bs.cross(Vs).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bs.subVectors(this.c,this.b),Vs.subVectors(this.a,this.b),Bs.cross(Vs).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Ws.subVectors(r,n),Gs.subVectors(i,n),qs.subVectors(e,n);let s=Ws.dot(qs),c=Gs.dot(qs);if(s<=0&&c<=0)return t.copy(n);Js.subVectors(e,r);let l=Ws.dot(Js),u=Gs.dot(Js);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Ws,a);Ys.subVectors(e,i);let f=Ws.dot(Ys),p=Gs.dot(Ys);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Gs,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Ks.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Ks,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Ws,a).addScaledVector(Gs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ec=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(nc.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(nc.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=nc.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,nc):nc.fromBufferAttribute(r,t),nc.applyMatrix4(e.matrixWorld),this.expandByPoint(nc);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),rc.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),rc.copy(e.boundingBox)),rc.applyMatrix4(e.matrixWorld),this.union(rc)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,nc),nc.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(uc),dc.subVectors(this.max,uc),ic.subVectors(e.a,uc),ac.subVectors(e.b,uc),oc.subVectors(e.c,uc),sc.subVectors(ac,ic),cc.subVectors(oc,ac),lc.subVectors(ic,oc);let t=[0,-sc.z,sc.y,0,-cc.z,cc.y,0,-lc.z,lc.y,sc.z,0,-sc.x,cc.z,0,-cc.x,lc.z,0,-lc.x,-sc.y,sc.x,0,-cc.y,cc.x,0,-lc.y,lc.x,0];return!mc(t,ic,ac,oc,dc)||(t=[1,0,0,0,1,0,0,0,1],!mc(t,ic,ac,oc,dc))?!1:(fc.crossVectors(sc,cc),t=[fc.x,fc.y,fc.z],mc(t,ic,ac,oc,dc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nc).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nc).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(tc[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),tc[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),tc[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),tc[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),tc[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),tc[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),tc[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),tc[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(tc)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},tc=[new V,new V,new V,new V,new V,new V,new V,new V],nc=new V,rc=new ec,ic=new V,ac=new V,oc=new V,sc=new V,cc=new V,lc=new V,uc=new V,dc=new V,fc=new V,pc=new V;function mc(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){pc.fromArray(e,a);let o=i.x*Math.abs(pc.x)+i.y*Math.abs(pc.y)+i.z*Math.abs(pc.z),s=t.dot(pc),c=n.dot(pc),l=r.dot(pc);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var hc=new V,gc=new B,_c=0,vc=class extends Co{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:_c++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=uo,this.updateRanges=[],this.gpuType=Qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)gc.fromBufferAttribute(this,t),gc.applyMatrix3(e),this.setXY(t,gc.x,gc.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)hc.fromBufferAttribute(this,t),hc.applyMatrix3(e),this.setXYZ(t,hc.x,hc.y,hc.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)hc.fromBufferAttribute(this,t),hc.applyMatrix4(e),this.setXYZ(t,hc.x,hc.y,hc.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hc.fromBufferAttribute(this,t),hc.applyNormalMatrix(e),this.setXYZ(t,hc.x,hc.y,hc.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hc.fromBufferAttribute(this,t),hc.transformDirection(e),this.setXYZ(t,hc.x,hc.y,hc.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jo(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Mo(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jo(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mo(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jo(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mo(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mo(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jo(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mo(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mo(t,this.array),n=Mo(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Mo(t,this.array),n=Mo(n,this.array),r=Mo(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Mo(t,this.array),n=Mo(n,this.array),r=Mo(r,this.array),i=Mo(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},yc=class extends vc{constructor(e,t,n){super(new Uint16Array(e),t,n)}},bc=class extends vc{constructor(e,t,n){super(new Uint32Array(e),t,n)}},xc=class extends vc{constructor(e,t,n){super(new Float32Array(e),t,n)}},Sc=new ec,Cc=new V,wc=new V,Tc=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Sc.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cc.subVectors(e,this.center);let t=Cc.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Cc,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cc.copy(e.center).add(wc)),this.expandByPoint(Cc.copy(e.center).sub(wc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ec=0,Dc=new rs,Oc=new As,kc=new V,Ac=new ec,jc=new ec,Mc=new V,Nc=class e extends Co{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ec++}),this.uuid=Do(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(po(e)?bc:yc)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Io().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Dc.makeRotationFromQuaternion(e),this.applyMatrix4(Dc),this}rotateX(e){return Dc.makeRotationX(e),this.applyMatrix4(Dc),this}rotateY(e){return Dc.makeRotationY(e),this.applyMatrix4(Dc),this}rotateZ(e){return Dc.makeRotationZ(e),this.applyMatrix4(Dc),this}translate(e,t,n){return Dc.makeTranslation(e,t,n),this.applyMatrix4(Dc),this}scale(e,t,n){return Dc.makeScale(e,t,n),this.applyMatrix4(Dc),this}lookAt(e){return Oc.lookAt(e),Oc.updateMatrix(),this.applyMatrix4(Oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(kc).negate(),this.translate(kc.x,kc.y,kc.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new xc(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&R(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ec);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)z(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ac.setFromBufferAttribute(n),this.morphTargetsRelative?(Mc.addVectors(this.boundingBox.min,Ac.min),this.boundingBox.expandByPoint(Mc),Mc.addVectors(this.boundingBox.max,Ac.max),this.boundingBox.expandByPoint(Mc)):(this.boundingBox.expandByPoint(Ac.min),this.boundingBox.expandByPoint(Ac.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&z(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Tc);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)z(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);else if(e){let n=this.boundingSphere.center;if(Ac.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jc.setFromBufferAttribute(n),this.morphTargetsRelative?(Mc.addVectors(Ac.min,jc.min),Ac.expandByPoint(Mc),Mc.addVectors(Ac.max,jc.max),Ac.expandByPoint(Mc)):(Ac.expandByPoint(jc.min),Ac.expandByPoint(jc.max))}Ac.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Mc.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Mc));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Mc.fromBufferAttribute(a,t),o&&(kc.fromBufferAttribute(e,t),Mc.add(kc)),r=Math.max(r,n.distanceToSquared(Mc))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&z(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){z(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new vc(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new B,f=new B,p=new B,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new vc(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mc.fromBufferAttribute(e,t),Mc.normalize(),e.setXYZ(t,Mc.x,Mc.y,Mc.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new vc(a,r,i)}if(this.index===null)return R(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Pc=new V,Fc=new V,Ic=new Io,Lc=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Pc.subVectors(n,t).cross(Fc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Pc),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ic.getNormalMatrix(e),r=this.coplanarPoint(Pc).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Rc=0,zc=class extends Co{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rc++}),this.uuid=Do(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new U(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lo,this.stencilZFail=lo,this.stencilZPass=lo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){R(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?R(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new U().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Lc().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new B().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Bc=new V,Vc=new V,Hc=new V,Uc=new V,Wc=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bc)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Bc.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Bc.copy(this.origin).addScaledVector(this.direction,t),Bc.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Vc.copy(e).add(t).multiplyScalar(.5),Hc.copy(t).sub(e).normalize(),Uc.copy(this.origin).sub(Vc);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Hc),o=Uc.dot(this.direction),s=-Uc.dot(Hc),c=Uc.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Vc).addScaledVector(Hc,d),f}intersectSphere(e,t){if(e.radius<0)return null;Bc.subVectors(e.center,this.origin);let n=Bc.dot(this.direction),r=Bc.dot(Bc)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Bc)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let te=S/w,ne=C/w,re=1/w,ie=T-te*D,ae=E-ne*D,oe=O-te*A,se=k-ne*A,N=j-te*M,ce=ee-ne*M,le=N*se-ce*oe,ue=ie*ce-ae*N,de=oe*ae-se*ie;if(r){if(le<0||ue<0||de<0)return null}else if((le<0||ue<0||de<0)&&(le>0||ue>0||de>0))return null;let fe=le+ue+de;if(fe===0)return null;let pe=re*(le*D+ue*A+de*M);return(fe>0?pe<0:pe>0)?null:this.at(pe/fe,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Gc=class extends zc{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new U(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ps,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Kc=new rs,qc=new Wc,Jc=new Tc,Yc=new V,Xc=new V,Zc=new V,Qc=new V,$c=new V,el=new V,tl=new V,nl=new V,W=class extends As{constructor(e=new Nc,t=new Gc){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){el.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&($c.fromBufferAttribute(s,e),a?el.addScaledVector($c,r):el.addScaledVector($c.sub(t),r))}t.add(el)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jc.copy(n.boundingSphere),Jc.applyMatrix4(i),qc.copy(e.ray).recast(e.near),!(Jc.containsPoint(qc.origin)===!1&&(qc.intersectSphere(Jc,Yc)===null||qc.origin.distanceToSquared(Yc)>(e.far-e.near)**2))&&(Kc.copy(i).invert(),qc.copy(e.ray).applyMatrix4(Kc),(n.boundingBox===null||qc.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,qc)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=il(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=il(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=il(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=il(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function rl(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;nl.copy(s),nl.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(nl);return l<n.near||l>n.far?null:{distance:l,point:nl.clone(),object:e}}function il(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Xc),e.getVertexPosition(c,Zc),e.getVertexPosition(l,Qc);let u=rl(e,t,n,r,Xc,Zc,Qc,tl);if(u){let e=new V;$s.getBarycoord(tl,Xc,Zc,Qc,e),i&&(u.uv=$s.getInterpolatedAttribute(i,s,c,l,e,new B)),a&&(u.uv1=$s.getInterpolatedAttribute(a,s,c,l,e,new B)),o&&(u.normal=$s.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};$s.getNormal(Xc,Zc,Qc,t.normal),u.face=t,u.barycoord=e}return u}var al=class extends Zo{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Bi,l=Bi,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ol=class extends vc{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},sl=new rs,cl=new rs,ll=[],ul=new ec,dl=new rs,fl=new W,pl=new Tc,ml=class extends W{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ol(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,dl)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ec),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,sl),ul.copy(e.boundingBox).applyMatrix4(sl),this.boundingBox.union(ul)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Tc),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,sl),pl.copy(e.boundingSphere).applyMatrix4(sl),this.boundingSphere.union(pl)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(fl.geometry=this.geometry,fl.material=this.material,fl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pl.copy(this.boundingSphere),pl.applyMatrix4(n),e.ray.intersectsSphere(pl)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,sl),cl.multiplyMatrices(n,sl),fl.matrixWorld=cl,fl.raycast(e,ll);for(let e=0,n=ll.length;e<n;e++){let n=ll[e];n.instanceId=i,n.object=this,t.push(n)}ll.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ol(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new al(new Float32Array(r*this.count),r,this.count,ua,Qi));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},hl=new Tc,gl=new B(.5,.5),_l=new V,vl=class{constructor(e=new Lc,t=new Lc,n=new Lc,r=new Lc,i=new Lc,a=new Lc){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fo,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hl.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),hl.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hl)}intersectsSprite(e){return hl.center.set(0,0,0),hl.radius=.7071067811865476+gl.distanceTo(e.center),hl.applyMatrix4(e.matrixWorld),this.intersectsSphere(hl)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(_l.x=r.normal.x>0?e.max.x:e.min.x,_l.y=r.normal.y>0?e.max.y:e.min.y,_l.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(_l)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},yl=class extends zc{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new U(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},bl=new V,xl=new V,Sl=new rs,Cl=new Wc,wl=new Tc,Tl=new V,El=new V,Dl=class extends As{constructor(e=new Nc,t=new yl){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)bl.fromBufferAttribute(t,e-1),xl.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=bl.distanceTo(xl);e.setAttribute(`lineDistance`,new xc(n,1))}else R(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wl.copy(n.boundingSphere),wl.applyMatrix4(r),wl.radius+=i,e.ray.intersectsSphere(wl)===!1)return;Sl.copy(r).invert(),Cl.copy(e.ray).applyMatrix4(Sl);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Ol(this,e,Cl,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Ol(this,e,Cl,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Ol(this,e,Cl,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Ol(this,e,Cl,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Ol(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(bl.fromBufferAttribute(s,i),xl.fromBufferAttribute(s,a),n.distanceSqToSegment(bl,xl,Tl,El)>r)return;Tl.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Tl);if(!(c<t.near||c>t.far))return{distance:c,point:El.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var kl=new V,Al=new V,jl=class extends Dl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)kl.fromBufferAttribute(t,e),Al.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+kl.distanceTo(Al);e.setAttribute(`lineDistance`,new xc(n,1))}else R(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Ml=class extends zc{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new U(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Nl=new rs,Pl=new Wc,Fl=new Tc,Il=new V,Ll=class extends As{constructor(e=new Nc,t=new Ml){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fl.copy(n.boundingSphere),Fl.applyMatrix4(r),Fl.radius+=i,e.ray.intersectsSphere(Fl)===!1)return;Nl.copy(r).invert(),Pl.copy(e.ray).applyMatrix4(Nl);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Il.fromBufferAttribute(l,n),Rl(Il,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Il.fromBufferAttribute(l,a),Rl(Il,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Rl(e,t,n,r,i,a,o){let s=Pl.distanceSqToPoint(e);if(s<n){let n=new V;Pl.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var zl=class extends Zo{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Bl=class extends Zo{constructor(e,t,n=Zi,r,i,a,o=Bi,s=Bi,c,l=ca,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Vl=class extends Bl{constructor(e,t=Zi,n=301,r,i,a=Bi,o=Bi,s,c=ca){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Hl=class extends Zo{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ul=class e extends Nc{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new xc(c,3)),this.setAttribute(`normal`,new xc(l,3)),this.setAttribute(`uv`,new xc(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Wl=class e extends Nc{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new B;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new xc(a,3)),this.setAttribute(`normal`,new xc(o,3)),this.setAttribute(`uv`,new xc(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Gl=class e extends Nc{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new xc(u,3)),this.setAttribute(`normal`,new xc(d,3)),this.setAttribute(`uv`,new xc(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Kl=class e extends Gl{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ql=class e extends Nc{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new xc(i,3)),this.setAttribute(`normal`,new xc(i.slice(),3)),this.setAttribute(`uv`,new xc(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new V,r=new V,i=new V;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new V;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new V;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new V,t=new V,n=new V,r=new V,o=new B,s=new B,c=new B;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Jl=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){R(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new B:new V);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new V,r=[],i=[],a=[],o=new V,s=new rs;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new V)}i[0]=new V,a[0]=new V;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(Oo(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(Oo(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Yl=class extends Jl{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new B){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Xl=class extends Yl{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Zl(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ql=new V,$l=new V,eu=new Zl,tu=new Zl,nu=new Zl,ru=class extends Jl{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new V){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:($l.subVectors(r[0],r[1]).add(r[0]),c=$l);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ql.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ql),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),eu.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),tu.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),nu.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(eu.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),tu.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),nu.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(eu.calc(s),tu.calc(s),nu.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function iu(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function au(e,t){let n=1-e;return n*n*t}function ou(e,t){return 2*(1-e)*e*t}function su(e,t){return e*e*t}function cu(e,t,n,r){return au(e,t)+ou(e,n)+su(e,r)}function lu(e,t){let n=1-e;return n*n*n*t}function uu(e,t){let n=1-e;return 3*n*n*e*t}function du(e,t){return 3*(1-e)*e*e*t}function fu(e,t){return e*e*e*t}function pu(e,t,n,r,i){return lu(e,t)+uu(e,n)+du(e,r)+fu(e,i)}var mu=class extends Jl{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(pu(e,r.x,i.x,a.x,o.x),pu(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},hu=class extends Jl{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(pu(e,r.x,i.x,a.x,o.x),pu(e,r.y,i.y,a.y,o.y),pu(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},gu=class extends Jl{constructor(e=new B,t=new B){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_u=class extends Jl{constructor(e=new V,t=new V){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},vu=class extends Jl{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(cu(e,r.x,i.x,a.x),cu(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yu=class extends Jl{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(cu(e,r.x,i.x,a.x),cu(e,r.y,i.y,a.y),cu(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},bu=class extends Jl{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new B){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(iu(o,s.x,c.x,l.x,u.x),iu(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new B().fromArray(n))}return this}},xu=Object.freeze({__proto__:null,ArcCurve:Xl,CatmullRomCurve3:ru,CubicBezierCurve:mu,CubicBezierCurve3:hu,EllipseCurve:Yl,LineCurve:gu,LineCurve3:_u,QuadraticBezierCurve:vu,QuadraticBezierCurve3:yu,SplineCurve:bu}),Su=class extends Jl{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new xu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new xu[n.type]().fromJSON(n))}return this}},Cu=class extends Su{constructor(e){super(),this.type=`Path`,this.currentPoint=new B,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new gu(this.currentPoint.clone(),new B(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new vu(this.currentPoint.clone(),new B(e,t),new B(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new mu(this.currentPoint.clone(),new B(e,t),new B(n,r),new B(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new bu([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Yl(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},wu=class extends Cu{constructor(e){super(e),this.uuid=Do(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Cu().fromJSON(n))}return this}};function Tu(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Eu(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Nu(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Ou(a,o,n,s,c,l,0),o}function Eu(e,t,n,r,i){let a;if(i===rd(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=ed(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=ed(i/r|0,e[i],e[i+1],a);return a&&Ku(a,a.next)&&(td(a),a=a.next),a}function Du(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Ku(n,n.next)||Gu(n.prev,n,n.next)===0)){if(td(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Ou(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ru(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Au(e,r,i,a):ku(e))t.push(c.i,e.i,l.i),td(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=ju(Du(e),t),Ou(e,t,n,r,i,a,2)):o===2&&Mu(e,t,n,r,i,a):Ou(Du(e),t,n,r,i,a,1);break}}}function ku(e){let t=e.prev,n=e,r=e.next;if(Gu(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Uu(i,s,a,c,o,l,m.x,m.y)&&Gu(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Au(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Gu(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Bu(p,m,t,n,r),v=Bu(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Uu(s,u,c,d,l,f,y.x,y.y)&&Gu(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Uu(s,u,c,d,l,f,b.x,b.y)&&Gu(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Uu(s,u,c,d,l,f,y.x,y.y)&&Gu(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Uu(s,u,c,d,l,f,b.x,b.y)&&Gu(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function ju(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ku(r,i)&&qu(r,n,n.next,i)&&Zu(r,i)&&Zu(i,r)&&(t.push(r.i,n.i,i.i),td(n),td(n.next),n=e=i),n=n.next}while(n!==e);return Du(n)}function Mu(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Wu(o,e)){let s=$u(o,e);o=Du(o,o.next),s=Du(s,s.next),Ou(o,t,n,r,i,a,0),Ou(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Nu(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Eu(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Vu(o))}i.sort(Pu);for(let e=0;e<i.length;e++)n=Fu(i[e],n);return n}function Pu(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Fu(e,t){let n=Iu(e,t);if(!n)return t;let r=$u(n,e);return Du(r,r.next),Du(n,n.next)}function Iu(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ku(e,n))return n;do{if(Ku(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Hu(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Zu(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Lu(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Lu(e,t){return Gu(e.prev,e,t.prev)<0&&Gu(t.next,e,e.next)<0}function Ru(e,t,n,r){let i=e;do i.z===0&&(i.z=Bu(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,zu(i)}function zu(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Bu(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Vu(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Hu(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Uu(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Hu(e,t,n,r,i,a,o,s)}function Wu(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Xu(e,t)&&(Zu(e,t)&&Zu(t,e)&&Qu(e,t)&&(Gu(e.prev,e,t.prev)||Gu(e,t.prev,t))||Ku(e,t)&&Gu(e.prev,e,e.next)>0&&Gu(t.prev,t,t.next)>0)}function Gu(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ku(e,t){return e.x===t.x&&e.y===t.y}function qu(e,t,n,r){let i=Yu(Gu(e,t,n)),a=Yu(Gu(e,t,r)),o=Yu(Gu(n,r,e)),s=Yu(Gu(n,r,t));return!!(i!==a&&o!==s||i===0&&Ju(e,n,t)||a===0&&Ju(e,r,t)||o===0&&Ju(n,e,r)||s===0&&Ju(n,t,r))}function Ju(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Yu(e){return e>0?1:e<0?-1:0}function Xu(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&qu(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Zu(e,t){return Gu(e.prev,e,e.next)<0?Gu(e,t,e.next)>=0&&Gu(e,e.prev,t)>=0:Gu(e,t,e.prev)<0||Gu(e,e.next,t)<0}function Qu(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function $u(e,t){let n=nd(e.i,e.x,e.y),r=nd(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function ed(e,t,n,r){let i=nd(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function td(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function nd(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function rd(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var id=class{static triangulate(e,t,n=2){return Tu(e,t,n)}},ad=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];od(e),sd(n,e);let a=e.length;t.forEach(od);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,sd(n,t[e]);let o=id.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function od(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function sd(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var cd=class e extends Nc{constructor(e=new wu([new B(.5,.5),new B(-.5,.5),new B(-.5,-.5),new B(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new xc(r,3)),this.setAttribute(`uv`,new xc(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?ld:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new V,b=new V,x=new V}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!ad.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];ad.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||z(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new B(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new B(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let ee=[],M,te=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];M=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),M[e]=A(t[e],t[r],t[i]);ee.push(M),te=te.concat(M)}let ne;if(p===0)ne=ad.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);N(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];M=ee[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],M[e],a);N(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}ne=ad.triangulateShape(e,t)}let re=ne.length,ie=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],te[e],ie):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),N(x.x,x.y,x.z)):N(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],te[t],ie):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),N(x.x,x.y,x.z)):N(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);N(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];M=ee[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],M[e],r);_?N(i.x,i.y+g[s-1].y,g[s-1].x+n):N(i.x,i.y,c+n)}}}ae(),oe();function ae(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<re;e++){let n=ne[e];ce(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<re;e++){let n=ne[e];ce(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<re;e++){let t=ne[e];ce(t[2],t[1],t[0])}for(let e=0;e<re;e++){let t=ne[e];ce(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function oe(){let e=r.length/3,t=0;se(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];se(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function se(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);le(t+r+n,t+i+n,t+i+a,t+r+a)}}}function N(e,t,n){a.push(e),a.push(t),a.push(n)}function ce(e,t,i){ue(e),ue(t),ue(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);de(o[0]),de(o[1]),de(o[2])}function le(e,t,i,a){ue(e),ue(t),ue(a),ue(t),ue(i),ue(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);de(s[0]),de(s[1]),de(s[3]),de(s[1]),de(s[2]),de(s[3])}function ue(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function de(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ud(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new xu[i.type]().fromJSON(i)),new e(r,t.options)}},ld={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new B(a,o),new B(s,c),new B(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new B(o,1-c),new B(l,1-d),new B(f,1-m),new B(h,1-_)]:[new B(s,1-c),new B(u,1-d),new B(p,1-m),new B(g,1-_)]}};function ud(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var dd=class e extends ql{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},fd=class e extends ql{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},pd=class e extends Nc{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new xc(p,3)),this.setAttribute(`normal`,new xc(m,3)),this.setAttribute(`uv`,new xc(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},md=class e extends Nc{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new V,p=new B;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new xc(s,3)),this.setAttribute(`normal`,new xc(c,3)),this.setAttribute(`uv`,new xc(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},hd=class e extends Nc{constructor(e=new wu([new B(0,.5),new B(-.5,-.5),new B(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new xc(r,3)),this.setAttribute(`normal`,new xc(i,3)),this.setAttribute(`uv`,new xc(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;ad.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];ad.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=ad.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return gd(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function gd(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var _d=class e extends Nc{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new V,f=new V,p=new V;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new xc(c,3)),this.setAttribute(`normal`,new xc(l,3)),this.setAttribute(`uv`,new xc(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function vd(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(bd(i))i.isRenderTargetTexture?(R(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(bd(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function yd(e){let t={};for(let n=0;n<e.length;n++){let r=vd(e[n]);for(let e in r)t[e]=r[e]}return t}function bd(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function xd(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Sd(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vo.workingColorSpace}var Cd={clone:vd,merge:yd},wd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Td=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ed=class extends zc{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wd,this.fragmentShader=Td,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=vd(e.uniforms),this.uniformsGroups=xd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new U().setHex(r.value);break;case`v2`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qo().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Io().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new rs().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Dd=class extends Ed{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Od=class extends zc{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new U(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new U(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ps,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},kd=class extends zc{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new U(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new U(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ps,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ad=class extends zc{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=io,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},jd=class extends zc{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Md(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Nd(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Pd=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Fd=class extends Pd{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:to,endingEnd:to}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case no:i=e,o=2*t-n;break;case ro:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case no:a=e,s=2*n-t;break;case ro:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Id=class extends Pd{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ld=class extends Pd{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Rd=class extends Pd{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Vd(n,t,g,y,r);i[p]=zd(x,o,_,b,m)}return i}};function zd(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Bd(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Vd(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=zd(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Bd(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Hd=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Md(t,this.TimeBufferType),this.values=Md(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Md(e.times,Array),values:Md(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Nd(e.settings)&&(n.settings={inTangents:Md(e.settings.inTangents,Array),outTangents:Md(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ld(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Id(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Fd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Rd(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Za:t=this.InterpolantFactoryMethodDiscrete;break;case Qa:t=this.InterpolantFactoryMethodLinear;break;case $a:t=this.InterpolantFactoryMethodSmooth;break;case eo:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return R(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Za;case this.InterpolantFactoryMethodLinear:return Qa;case this.InterpolantFactoryMethodSmooth:return $a;case this.InterpolantFactoryMethodBezier:return eo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Nd(this.settings)&&(Ud(this.settings.inTangents,e),Ud(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(z(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(z(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){z(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){z(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&mo(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){z(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===$a,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Nd(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ud(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Hd.prototype.ValueTypeName=``,Hd.prototype.TimeBufferType=Float32Array,Hd.prototype.ValueBufferType=Float32Array,Hd.prototype.DefaultInterpolation=Qa;var Wd=class extends Hd{constructor(e,t,n){super(e,t,n)}};Wd.prototype.ValueTypeName=`bool`,Wd.prototype.ValueBufferType=Array,Wd.prototype.DefaultInterpolation=Za,Wd.prototype.InterpolantFactoryMethodLinear=void 0,Wd.prototype.InterpolantFactoryMethodSmooth=void 0;var Gd=class extends Hd{constructor(e,t,n,r){super(e,t,n,r)}};Gd.prototype.ValueTypeName=`color`;var Kd=class extends Hd{constructor(e,t,n,r){super(e,t,n,r)}};Kd.prototype.ValueTypeName=`number`;var qd=class extends Pd{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)No.slerpFlat(i,0,a,c-o,a,c,s);return i}},Jd=class extends Hd{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new qd(this.times,this.values,this.getValueSize(),e)}};Jd.prototype.ValueTypeName=`quaternion`,Jd.prototype.InterpolantFactoryMethodSmooth=void 0;var Yd=class extends Hd{constructor(e,t,n){super(e,t,n)}};Yd.prototype.ValueTypeName=`string`,Yd.prototype.ValueBufferType=Array,Yd.prototype.DefaultInterpolation=Za,Yd.prototype.InterpolantFactoryMethodLinear=void 0,Yd.prototype.InterpolantFactoryMethodSmooth=void 0;var Xd=class extends Hd{constructor(e,t,n,r){super(e,t,n,r)}};Xd.prototype.ValueTypeName=`vector`;var Zd=class extends As{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new U(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Qd=class extends Zd{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(As.DEFAULT_UP),this.updateMatrix(),this.groundColor=new U(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},$d=new rs,ef=new V,tf=new V,nf=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=Ki,this.map=null,this.mapPass=null,this.matrix=new rs,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vl,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Qo(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ef.setFromMatrixPosition(e.matrixWorld),t.position.copy(ef),tf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(tf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){$d.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix($d,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply($d)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},rf=new V,af=new No,of=new V,sf=class extends As{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new rs,this.projectionMatrix=new rs,this.projectionMatrixInverse=new rs,this.coordinateSystem=fo,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(rf,af,of),of.x===1&&of.y===1&&of.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rf,af,of.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(rf,af,of),of.x===1&&of.y===1&&of.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rf,af,of.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},cf=new V,lf=new B,uf=new B,df=class extends sf{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Eo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(To*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(To*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){cf.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(cf.x,cf.y).multiplyScalar(-e/cf.z),cf.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(cf.x,cf.y).multiplyScalar(-e/cf.z)}getViewSize(e,t){return this.getViewBounds(e,lf,uf),t.subVectors(uf,lf)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(To*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ff=class extends nf{constructor(){super(new df(90,1,.5,500)),this.isPointLightShadow=!0}},pf=class extends Zd{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new ff}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},mf=class extends sf{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},hf=class extends nf{constructor(){super(new mf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},gf=class extends Zd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(As.DEFAULT_UP),this.updateMatrix(),this.target=new As,this.shadow=new hf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},_f=-90,vf=1,yf=class extends As{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new df(_f,vf,e,t);r.layers=this.layers,this.add(r);let i=new df(_f,vf,e,t);i.layers=this.layers,this.add(i);let a=new df(_f,vf,e,t);a.layers=this.layers,this.add(a);let o=new df(_f,vf,e,t);o.layers=this.layers,this.add(o);let s=new df(_f,vf,e,t);s.layers=this.layers,this.add(s);let c=new df(_f,vf,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},bf=class extends df{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},xf=`\\[\\]\\.:\\/`,Sf=RegExp(`[\\[\\]\\.:\\/]`,`g`),Cf=`[^\\[\\]\\.:\\/]`,wf=`[^`+xf.replace(`\\.`,``)+`]`,Tf=`((?:WC+[\\/:])*)`.replace(`WC`,Cf),Ef=`(WCOD+)?`.replace(`WCOD`,wf),Df=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Cf),Of=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Cf),kf=RegExp(`^`+Tf+Ef+Df+Of+`$`),Af=[`material`,`materials`,`bones`,`map`],jf=class{constructor(e,t,n){let r=n||Mf.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Mf=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Sf,``)}static parseTrackName(e){let t=kf.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Af.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){R(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){z(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){z(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){z(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){z(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){z(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;z(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Mf.Composite=jf,Mf.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Mf.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Mf.prototype.GetterByBindingType=[Mf.prototype._getValue_direct,Mf.prototype._getValue_array,Mf.prototype._getValue_arrayElement,Mf.prototype._getValue_toArray],Mf.prototype.SetterByBindingTypeAndVersioning=[[Mf.prototype._setValue_direct,Mf.prototype._setValue_direct_setNeedsUpdate,Mf.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mf.prototype._setValue_array,Mf.prototype._setValue_array_setNeedsUpdate,Mf.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mf.prototype._setValue_arrayElement,Mf.prototype._setValue_arrayElement_setNeedsUpdate,Mf.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mf.prototype._setValue_fromArray,Mf.prototype._setValue_fromArray_setNeedsUpdate,Mf.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Nf=new rs,Pf=class{constructor(e,t,n=0,r=1/0){this.ray=new Wc(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):z(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Nf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Nf),this}intersectObject(e,t=!0,n=[]){return If(e,this,n,t),n.sort(Ff),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)If(e[r],this,n,t);return n.sort(Ff),n}};function Ff(e,t){return e.distance-t.distance}function If(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)If(r[e],t,n,!0)}}var Lf=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,R(`Clock: This module has been deprecated. Please use THREE.Timer instead.`)}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function Rf(e,t,n,r){let i=zf(r);switch(n){case aa:return e*t;case ua:return e*t/i.components*i.byteLength;case da:return e*t/i.components*i.byteLength;case fa:return e*t*2/i.components*i.byteLength;case pa:return e*t*2/i.components*i.byteLength;case oa:return e*t*3/i.components*i.byteLength;case sa:return e*t*4/i.components*i.byteLength;case ma:return e*t*4/i.components*i.byteLength;case ha:case ga:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case _a:case va:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ba:case Sa:return Math.max(e,16)*Math.max(t,8)/4;case ya:case xa:return Math.max(e,8)*Math.max(t,8)/2;case Ca:case wa:case Ea:case Da:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ta:case Oa:case ka:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Aa:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ja:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ma:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Na:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Pa:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Fa:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ia:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case La:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ra:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case za:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ba:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Va:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ha:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ua:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Wa:case Ga:case Ka:return Math.ceil(e/4)*Math.ceil(t/4)*16;case qa:case Ja:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ya:case Xa:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function zf(e){switch(e){case Ki:case qi:return{byteLength:1,components:1};case Yi:case Ji:case $i:return{byteLength:2,components:1};case ea:case ta:return{byteLength:2,components:4};case Zi:case Xi:case Qi:return{byteLength:4,components:1};case ra:case ia:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?R(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Bf(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Vf(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Hf={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},G={common:{diffuse:{value:new U(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Io},alphaMap:{value:null},alphaMapTransform:{value:new Io},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Io}},envmap:{envMap:{value:null},envMapRotation:{value:new Io},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Io}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Io}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Io},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Io},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Io},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Io}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Io}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Io}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new U(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new U(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Io},alphaTest:{value:0},uvTransform:{value:new Io}},sprite:{diffuse:{value:new U(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Io},alphaMap:{value:null},alphaMapTransform:{value:new Io},alphaTest:{value:0}}},Uf={basic:{uniforms:yd([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.fog]),vertexShader:Hf.meshbasic_vert,fragmentShader:Hf.meshbasic_frag},lambert:{uniforms:yd([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new U(0)},envMapIntensity:{value:1}}]),vertexShader:Hf.meshlambert_vert,fragmentShader:Hf.meshlambert_frag},phong:{uniforms:yd([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new U(0)},specular:{value:new U(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Hf.meshphong_vert,fragmentShader:Hf.meshphong_frag},standard:{uniforms:yd([G.common,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.roughnessmap,G.metalnessmap,G.fog,G.lights,{emissive:{value:new U(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Hf.meshphysical_vert,fragmentShader:Hf.meshphysical_frag},toon:{uniforms:yd([G.common,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.gradientmap,G.fog,G.lights,{emissive:{value:new U(0)}}]),vertexShader:Hf.meshtoon_vert,fragmentShader:Hf.meshtoon_frag},matcap:{uniforms:yd([G.common,G.bumpmap,G.normalmap,G.displacementmap,G.fog,{matcap:{value:null}}]),vertexShader:Hf.meshmatcap_vert,fragmentShader:Hf.meshmatcap_frag},points:{uniforms:yd([G.points,G.fog]),vertexShader:Hf.points_vert,fragmentShader:Hf.points_frag},dashed:{uniforms:yd([G.common,G.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Hf.linedashed_vert,fragmentShader:Hf.linedashed_frag},depth:{uniforms:yd([G.common,G.displacementmap]),vertexShader:Hf.depth_vert,fragmentShader:Hf.depth_frag},normal:{uniforms:yd([G.common,G.bumpmap,G.normalmap,G.displacementmap,{opacity:{value:1}}]),vertexShader:Hf.meshnormal_vert,fragmentShader:Hf.meshnormal_frag},sprite:{uniforms:yd([G.sprite,G.fog]),vertexShader:Hf.sprite_vert,fragmentShader:Hf.sprite_frag},background:{uniforms:{uvTransform:{value:new Io},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Hf.background_vert,fragmentShader:Hf.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Io}},vertexShader:Hf.backgroundCube_vert,fragmentShader:Hf.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Hf.cube_vert,fragmentShader:Hf.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Hf.equirect_vert,fragmentShader:Hf.equirect_frag},distance:{uniforms:yd([G.common,G.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Hf.distance_vert,fragmentShader:Hf.distance_frag},shadow:{uniforms:yd([G.lights,G.fog,{color:{value:new U(0)},opacity:{value:1}}]),vertexShader:Hf.shadow_vert,fragmentShader:Hf.shadow_frag}};Uf.physical={uniforms:yd([Uf.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Io},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Io},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Io},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Io},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Io},sheen:{value:0},sheenColor:{value:new U(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Io},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Io},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Io},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Io},attenuationDistance:{value:0},attenuationColor:{value:new U(0)},specularColor:{value:new U(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Io},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Io},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Io}}]),vertexShader:Hf.meshphysical_vert,fragmentShader:Hf.meshphysical_frag};var Wf={r:0,b:0,g:0},Gf=new rs,Kf=new Io;Kf.set(-1,0,0,0,1,0,0,0,1);function qf(e,t,n,r,i,a){let o=new U(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new W(new Ul(1,1,1),new Ed({name:`BackgroundCubeMaterial`,uniforms:vd(Uf.backgroundCube.uniforms),vertexShader:Uf.backgroundCube.vertexShader,fragmentShader:Uf.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Gf.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Kf),l.material.toneMapped=Vo.getTransfer(i.colorSpace)!==co,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new W(new pd(2,2),new Ed({name:`BackgroundMaterial`,uniforms:vd(Uf.background.uniforms),vertexShader:Uf.background.vertexShader,fragmentShader:Uf.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vo.getTransfer(i.colorSpace)!==co,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Wf,Sd(e)),n.buffers.color.setClear(Wf.r,Wf.g,Wf.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Jf(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Yf(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Xf(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(R(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&R(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Zf(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Lc,s=new Io,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Qf=4,$f=6,ep=20,tp=256,np=new mf,rp=new U,ip=null,ap=0,op=0,sp=!1,cp=new V,lp=new V,up=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=cp}=i;ip=this._renderer.getRenderTarget(),ap=this._renderer.getActiveCubeFace(),op=this._renderer.getActiveMipmapLevel(),sp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_p(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ip,ap,op),this._renderer.xr.enabled=sp,e.scissorTest=!1,pp(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ip=this._renderer.getRenderTarget(),ap=this._renderer.getActiveCubeFace(),op=this._renderer.getActiveMipmapLevel(),sp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ui,minFilter:Ui,generateMipmaps:!1,type:$i,format:sa,colorSpace:oo,depthBuffer:!1},r=fp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=dp(r)),this._blurMaterial=hp(r,e,t),this._ggxMaterial=mp(r,e,t)}return r}_compileMaterial(e){let t=new W(new Nc,e);this._renderer.compile(t,np)}_sceneToCubeUV(e,t,n,r,i){let a=new df(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(rp),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new W(new Ul,new Gc({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(rp),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;pp(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=_p()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gp());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;pp(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,np)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Qf?n-d+Qf:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,pp(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,np),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,pp(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,np)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];pp(t,3*l*(r>this._lodMax-Qf?r-this._lodMax+Qf:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,np)}};function dp(e){let t=[],n=[],r=e,i=e-Qf+1+$f;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?lp.set(1,r,n):e===1?lp.set(-n,1,-r):e===2?lp.set(-n,r,1):e===3?lp.set(-1,r,-n):e===4?lp.set(-n,-1,r):lp.set(n,r,-1),lp.toArray(l,(e*6+t)*3)}}let u=new Nc;u.setAttribute(`position`,new vc(c,3)),u.setAttribute(`outputDirection`,new vc(l,3)),n.push(new W(u,null)),r>Qf&&r--}return{lodMeshes:n,sizeLods:t}}function fp(e,t,n){let r=new es(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function pp(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function mp(e,t,n){return new Ed({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:tp,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:vp(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function hp(e,t,n){return new Ed({name:`SphericalGaussianBlur`,defines:{SAMPLES:ep,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:vp(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function gp(){return new Ed({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:vp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _p(){return new Ed({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function vp(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var yp=class extends es{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new zl(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ul(5,5,5),i=new Ed({name:`CubemapFromEquirect`,uniforms:vd(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new W(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Ui),new yf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function bp(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new yp(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new up(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new up(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function xp(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&bo(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Sp(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?bc:yc)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Cp(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function wp(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:z(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Tp(e,t,n){let r=new WeakMap,i=new Qo;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new ts(h,p,m,u);g.type=Qi,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new B(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ep(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Dp={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Op(e,t,n,r,i,a){let o=new es(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Nc;l.setAttribute(`position`,new xc([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new xc([0,2,0,0,2,0],2));let u=new Dd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new W(l,u),f=new mf(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new es(t,n,{type:$i,depthBuffer:!1,stencilBuffer:!1}),c=new es(t,n,{type:$i,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Vo.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Dp[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var kp=new Zo,Ap=new Bl(1,1),jp=new ts,Mp=new ns,Np=new zl,Pp=[],Fp=[],Ip=new Float32Array(16),Lp=new Float32Array(9),Rp=new Float32Array(4);function zp(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Pp[i];if(a===void 0&&(a=new Float32Array(i),Pp[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Bp(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Vp(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Hp(e,t){let n=Fp[t];n===void 0&&(n=new Int32Array(t),Fp[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Up(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Wp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Bp(n,t))return;e.uniform2fv(this.addr,t),Vp(n,t)}}function Gp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Bp(n,t))return;e.uniform3fv(this.addr,t),Vp(n,t)}}function Kp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Bp(n,t))return;e.uniform4fv(this.addr,t),Vp(n,t)}}function qp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Bp(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Vp(n,t)}else{if(Bp(n,r))return;Rp.set(r),e.uniformMatrix2fv(this.addr,!1,Rp),Vp(n,r)}}function Jp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Bp(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Vp(n,t)}else{if(Bp(n,r))return;Lp.set(r),e.uniformMatrix3fv(this.addr,!1,Lp),Vp(n,r)}}function Yp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Bp(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Vp(n,t)}else{if(Bp(n,r))return;Ip.set(r),e.uniformMatrix4fv(this.addr,!1,Ip),Vp(n,r)}}function Xp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Zp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Bp(n,t))return;e.uniform2iv(this.addr,t),Vp(n,t)}}function Qp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Bp(n,t))return;e.uniform3iv(this.addr,t),Vp(n,t)}}function $p(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Bp(n,t))return;e.uniform4iv(this.addr,t),Vp(n,t)}}function em(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function tm(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Bp(n,t))return;e.uniform2uiv(this.addr,t),Vp(n,t)}}function nm(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Bp(n,t))return;e.uniform3uiv(this.addr,t),Vp(n,t)}}function rm(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Bp(n,t))return;e.uniform4uiv(this.addr,t),Vp(n,t)}}function im(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Ap.compareFunction=n.isReversedDepthBuffer()?518:515,a=Ap):a=kp,n.setTexture2D(t||a,i)}function am(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Mp,i)}function om(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Np,i)}function sm(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||jp,i)}function cm(e){switch(e){case 5126:return Up;case 35664:return Wp;case 35665:return Gp;case 35666:return Kp;case 35674:return qp;case 35675:return Jp;case 35676:return Yp;case 5124:case 35670:return Xp;case 35667:case 35671:return Zp;case 35668:case 35672:return Qp;case 35669:case 35673:return $p;case 5125:return em;case 36294:return tm;case 36295:return nm;case 36296:return rm;case 35678:case 36198:case 36298:case 36306:case 35682:return im;case 35679:case 36299:case 36307:return am;case 35680:case 36300:case 36308:case 36293:return om;case 36289:case 36303:case 36311:case 36292:return sm}}function lm(e,t){e.uniform1fv(this.addr,t)}function um(e,t){let n=zp(t,this.size,2);e.uniform2fv(this.addr,n)}function dm(e,t){let n=zp(t,this.size,3);e.uniform3fv(this.addr,n)}function fm(e,t){let n=zp(t,this.size,4);e.uniform4fv(this.addr,n)}function pm(e,t){let n=zp(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function mm(e,t){let n=zp(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function hm(e,t){let n=zp(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function gm(e,t){e.uniform1iv(this.addr,t)}function _m(e,t){e.uniform2iv(this.addr,t)}function vm(e,t){e.uniform3iv(this.addr,t)}function ym(e,t){e.uniform4iv(this.addr,t)}function bm(e,t){e.uniform1uiv(this.addr,t)}function xm(e,t){e.uniform2uiv(this.addr,t)}function Sm(e,t){e.uniform3uiv(this.addr,t)}function Cm(e,t){e.uniform4uiv(this.addr,t)}function wm(e,t,n){let r=this.cache,i=t.length,a=Hp(n,i);Bp(r,a)||(e.uniform1iv(this.addr,a),Vp(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Ap:kp;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Tm(e,t,n){let r=this.cache,i=t.length,a=Hp(n,i);Bp(r,a)||(e.uniform1iv(this.addr,a),Vp(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Mp,a[e])}function Em(e,t,n){let r=this.cache,i=t.length,a=Hp(n,i);Bp(r,a)||(e.uniform1iv(this.addr,a),Vp(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Np,a[e])}function Dm(e,t,n){let r=this.cache,i=t.length,a=Hp(n,i);Bp(r,a)||(e.uniform1iv(this.addr,a),Vp(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||jp,a[e])}function Om(e){switch(e){case 5126:return lm;case 35664:return um;case 35665:return dm;case 35666:return fm;case 35674:return pm;case 35675:return mm;case 35676:return hm;case 5124:case 35670:return gm;case 35667:case 35671:return _m;case 35668:case 35672:return vm;case 35669:case 35673:return ym;case 5125:return bm;case 36294:return xm;case 36295:return Sm;case 36296:return Cm;case 35678:case 36198:case 36298:case 36306:case 35682:return wm;case 35679:case 36299:case 36307:return Tm;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return Dm}}var km=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=cm(t.type)}},Am=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Om(t.type)}},jm=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Mm=/(\w+)(\])?(\[|\.)?/g;function Nm(e,t){e.seq.push(t),e.map[t.id]=t}function Pm(e,t,n){let r=e.name,i=r.length;for(Mm.lastIndex=0;;){let a=Mm.exec(r),o=Mm.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Nm(n,l===void 0?new km(s,e,t):new Am(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new jm(s),Nm(n,e)),n=e}}}var Fm=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Pm(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Im(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Lm=37297,Rm=0;function zm(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Bm=new Io;function Vm(e){Vo._getMatrix(Bm,Vo.workingColorSpace,e);let t=`mat3( ${Bm.elements.map(e=>e.toFixed(4))} )`;switch(Vo.getTransfer(e)){case so:return[t,`LinearTransferOETF`];case co:return[t,`sRGBTransferOETF`];default:return R(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Hm(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+zm(e.getShaderSource(t),r)}return i}function Um(e,t){let n=Vm(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Wm={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Gm(e,t){let n=Wm[t];return n===void 0?(R(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Km=new V;function qm(){return Vo.getLuminanceCoefficients(Km),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Km.x.toFixed(4)}, ${Km.y.toFixed(4)}, ${Km.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Jm(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Zm).join(`
`)}function Ym(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Xm(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Zm(e){return e!==``}function Qm(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $m(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var eh=/^[ \t]*#include +<([\w\d./]+)>/gm;function th(e){return e.replace(eh,rh)}var nh=new Map;function rh(e,t){let n=Hf[t];if(n===void 0){let e=nh.get(t);if(e!==void 0)n=Hf[e],R(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return th(n)}var ih=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ah(e){return e.replace(ih,oh)}function oh(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function sh(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var ch={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function lh(e){return ch[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var uh={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function dh(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:uh[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var fh={302:`ENVMAP_MODE_REFRACTION`};function ph(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:fh[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var mh={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function hh(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:mh[e.combine]||`ENVMAP_BLENDING_NONE`}function gh(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function _h(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=lh(n),l=dh(n),u=ph(n),d=hh(n),f=gh(n),p=Jm(n),m=Ym(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Zm).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Zm).join(`
`),_.length>0&&(_+=`
`)):(g=[sh(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Zm).join(`
`),_=[sh(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Hf.tonemapping_pars_fragment,n.toneMapping===0?``:Gm(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Hf.colorspace_pars_fragment,Um(`linearToOutputTexel`,n.outputColorSpace),qm(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Zm).join(`
`)),o=th(o),o=Qm(o,n),o=$m(o,n),s=th(s),s=Qm(s,n),s=$m(s,n),o=ah(o),s=ah(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Im(i,i.VERTEX_SHADER,y),S=Im(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Hm(i,x,`vertex`),n=Hm(i,S,`fragment`);z(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):R(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Fm(i,h),T=Xm(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Lm)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Rm++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var vh=0,yh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new bh(e),t.set(e,n)),n}},bh=class{constructor(e){this.id=vh++,this.code=e,this.usedTimes=0}};function xh(e){return e===1030||e===37490||e===36285}function Sh(e,t,n,r,i,a){let o=new ms,s=new yh,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&R(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Uf[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,te=h.isBatchedMesh===!0,ne=!!i.map,re=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,N=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,ue=!!i.metalnessMap,de=!!i.roughnessMap,fe=i.anisotropy>0,pe=i.clearcoat>0,me=i.dispersion>0,he=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=fe&&!!i.anisotropyMap,be=pe&&!!i.clearcoatMap,xe=pe&&!!i.clearcoatNormalMap,Se=pe&&!!i.clearcoatRoughnessMap,Ce=ge&&!!i.iridescenceMap,P=ge&&!!i.iridescenceThicknessMap,we=_e&&!!i.sheenColorMap,Te=_e&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,F=!!i.specularColorMap,De=!!i.specularIntensityMap,I=ve&&!!i.transmissionMap,Oe=ve&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,Ne=!!i.extensions,Pe=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let Fe={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:te,batchingColor:te&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Vo.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:re,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:N,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:N&&i.normalMapType===1,normalMapTangentSpace:N&&i.normalMapType===0,packedNormalMap:N&&i.normalMapType===0&&xh(i.normalMap.format),metalnessMap:ue,roughnessMap:de,anisotropy:fe,anisotropyMap:ye,clearcoat:pe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,dispersion:me,retroreflection:he,iridescence:ge,iridescenceMap:Ce,iridescenceThicknessMap:P,sheen:_e,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:F,specularIntensityMap:De,transmission:ve,transmissionMap:I,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:N&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:ue&&m(i.metalnessMap.channel),roughnessMapUv:de&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:be&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:P&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:F&&m(i.specularColorMap.channel),specularIntensityMapUv:De&&m(i.specularIntensityMap.channel),transmissionMapUv:I&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:Ae&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(N||fe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Ae),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&N===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&Vo.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Vo.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ne&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&i.extensions.multiDraw===!0||te)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Fe.vertexUv1s=c.has(1),Fe.vertexUv2s=c.has(2),Fe.vertexUv3s=c.has(3),c.clear(),Fe}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Uf[t];n=Cd.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new _h(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Ch(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function wh(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Th(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Eh(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||wh),r.length>1&&r.sort(t||Th),i.length>1&&i.sort(t||Th)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Dh(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Eh,e.set(t,[i])):n>=r.length?(i=new Eh,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Oh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new V,color:new U};break;case`SpotLight`:n={position:new V,direction:new V,color:new U,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new U,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new U,groundColor:new U};break;case`RectAreaLight`:n={color:new U,position:new V,halfWidth:new V,halfHeight:new V}}return e[t.id]=n,n}}}function kh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ah=0;function jh(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Mh(e){let t=new Oh,n=kh(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new rs,o=new rs;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(jh);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=G.LTC_FLOAT_1,r.rectAreaLTC2=G.LTC_FLOAT_2):(r.rectAreaLTC1=G.LTC_HALF_1,r.rectAreaLTC2=G.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Ah++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Nh(e){let t=new Mh(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Ph(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Nh(e),t.set(n,[a])):r>=i.length?(a=new Nh(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Fh=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ih=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Lh=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Rh=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],zh=new rs,Bh=new V,Vh=new V;function Hh(e,t,n){let r=new vl,i=new B,a=new B,o=new Qo,s=new Ad,c=new jd,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Ed({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:Fh,fragmentShader:Ih}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Nc;m.setAttribute(`position`,new vc(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new W(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(R(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){R(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){R(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new es(i.x,i.y,{format:fa,type:$i,minFilter:Ui,magFilter:Ui,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Bl(i.x,i.y,Qi),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ca,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Bi,d.map.depthTexture.magFilter=Bi}else l.isPointLight?(d.map=new yp(i.x),d.map.depthTexture=new Vl(i.x,Zi)):(d.map=new es(i.x,i.y),d.map.depthTexture=new Bl(i.x,i.y,Zi)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ca,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Ui,d.map.depthTexture.magFilter=Ui):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Bi,d.map.depthTexture.magFilter=Bi);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Bh.setFromMatrixPosition(l.matrixWorld),e.position.copy(Bh),Vh.copy(e.position),Vh.add(Lh[t]),e.up.copy(Rh[t]),e.lookAt(Vh),e.updateMatrixWorld(),n.makeTranslation(-Bh.x,-Bh.y,-Bh.z),zh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(zh,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new es(i.x,i.y,{format:fa,type:$i}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Uh(e,t){function n(){let t=!1,n=new Qo,r=null,i=new Qo(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ue(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=So[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ue(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(ne)[1]),M=te>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Qo().fromArray(ae),N=new Qo().fromArray(oe);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ue(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),ue(e.CULL_FACE),_e(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return h!==t&&(e.useProgram(t),h=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let ge={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function _e(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(de(e.BLEND),g=!1);else if(g===!1&&(ue(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:z(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:z(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:z(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:z(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(he[n],he[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ge[r],ge[i],ge[o],ge[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ve(t,n){t.side===2?de(e.CULL_FACE):ue(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?_e(0):_e(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Se(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?de(e.CULL_FACE):(ue(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function xe(t){t!==k&&(M&&e.lineWidth(t),k=t)}function Se(t,n,r){t?(ue(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function Ce(t){t?ue(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function P(t){t===void 0&&(t=e.TEXTURE0+ee-1),re!==t&&(e.activeTexture(t),re=t)}function we(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+ee-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function F(){try{e.compressedTexImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function I(){try{e.texSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Me(){try{e.texImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Pe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Fe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Ie(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Le(t){N.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),N.copy(t))}function Re(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,se.set(0,0,e.canvas.width,e.canvas.height),N.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ue,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:_e,setMaterial:ve,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:Se,setScissorTest:Ce,activeTexture:P,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:F,texImage2D:Me,texImage3D:Ne,pixelStorei:Fe,getParameter:Pe,updateUBOMapping:Re,uniformBlockBinding:ze,texStorage2D:Ae,texStorage3D:je,texSubImage2D:De,texSubImage3D:I,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:Ie,viewport:Le,reset:Be}}function Wh(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new B,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):ho(`canvas`)}function g(e,t,n){let r=1,i=Ee(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),R(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&R(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];R(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||R(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?so:Vo.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,R(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function ee(){let e=O;return e>=i.maxTextures&&R(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function te(t,i){let a=r.get(t);if(t.isVideoTexture&&we(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)R(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)R(`WebGLRenderer: Texture marked for update but image is incomplete`);else{de(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ne(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?de(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function re(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?de(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?fe(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[Li]:e.REPEAT,[Ri]:e.CLAMP_TO_EDGE,[zi]:e.MIRRORED_REPEAT},oe={[Bi]:e.NEAREST,[Vi]:e.NEAREST_MIPMAP_NEAREST,[Hi]:e.NEAREST_MIPMAP_LINEAR,[Ui]:e.LINEAR,[Wi]:e.LINEAR_MIPMAP_NEAREST,[Gi]:e.LINEAR_MIPMAP_LINEAR},se={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function N(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&R(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,se[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ce(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=M(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function le(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ue(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=le(n.start,r.width,4),c=le(t.start,r.width,4);n.start<=i+1&&a===c&&le(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function de(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ce(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Vo.getPrimaries(Vo.workingColorSpace),r=o.colorSpace===``?null:Vo.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Te(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);N(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===la,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ue(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=Rf(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Rf(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ee(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ee(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function fe(t,o,s){if(o.image.length!==6)return;let c=ce(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Vo.getPrimaries(Vo.workingColorSpace),r=o.colorSpace===``?null:Vo.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Te(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);N(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ee(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function pe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ce(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function me(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function he(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),N(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else te(i.depthTexture,0);let u=l.__webglTexture,d=Ce(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ge(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)he(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?he(i.__webglFramebuffer[0],t,0):he(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),me(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),me(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,i){let a=r.get(t);n!==void 0&&pe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ge(t)}function ve(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&P(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ce(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),me(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),N(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)pe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),N(c,a),pe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),N(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else pe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ge(t)}function ye(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let be=[],xe=[];function Se(t){if(t.samples>0){if(P(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(be.length=0,xe.length=0,be.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(be.push(l),xe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,xe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,be))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ce(e){return Math.min(i.maxSamples,e.samples)}function P(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function we(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Te(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vo.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&R(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):z(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ee(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ee,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=te,this.setTexture2DArray=ne,this.setTexture3D=re,this.setTextureCube=ie,this.rebindTextures=_e,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=P,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Gh(e,t){function n(n,r=``){let i,a=Vo.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Kh=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qh=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Jh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Hl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ed({vertexShader:Kh,fragmentShader:qh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new W(new pd(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Yh=class extends Co{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Jh,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new B,C=null,w=null,T=new df;T.viewport=new Qo;let E=new df;E.viewport=new Qo;let D=[T,E],O=new bf,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Ms,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Ms,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Ms,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,N.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?la:ca,a=_.stencil?na:Zi);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new es(d.textureWidth,d.textureHeight,{format:sa,type:Ki,depthTexture:new Bl(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new es(f.framebufferWidth,f.framebufferHeight,{format:sa,type:Ki,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),N.setContext(r),N.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let te=new V,ne=new V;function re(e,t,n){te.setFromMatrixPosition(t.matrixWorld),ne.setFromMatrixPosition(n.matrixWorld);let r=te.distanceTo(ne),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ie(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ie(O,i);for(let e=0;e<a.length;e++)ie(a[e],i);a.length===2?re(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ae(e,O,i)};function ae(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Eo*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let oe=null;function se(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new df,o.layers.enable(n),o.viewport=new Qo,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Hl,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}oe&&oe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let N=new Bf;N.setAnimationLoop(se),this.setAnimationLoop=function(e){oe=e},this.dispose=function(){}}},Xh=new rs,Zh=new Io;Zh.set(-1,0,0,0,1,0,0,0,1);function Qh(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Sd(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Xh.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Zh),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function $h(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return z(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?R(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):R(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var eg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),tg=null;function ng(){return tg===null&&(tg=new al(eg,16,16,fa,$i),tg.name=`DFG_LUT`,tg.minFilter=Ui,tg.magFilter=Ui,tg.wrapS=Ri,tg.wrapT=Ri,tg.generateMipmaps=!1,tg.needsUpdate=!0),tg}var rg=class{constructor(e={}){let{canvas:t=go(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Ki}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ma,pa,da]),g=new Set([Ki,Zi,Yi,na,ea,ta]),_=new Uint32Array(4),v=new Int32Array(4),y=new V,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=ao;let j=0,ee=0,M=null,te=-1,ne=null,re=new Qo,ie=new Qo,ae=null,oe=new U(0),se=0,N=t.width,ce=t.height,le=1,ue=null,de=null,fe=new Qo(0,0,N,ce),pe=new Qo(0,0,N,ce),me=!1,he=new vl,ge=!1,_e=!1,ve=new rs,ye=new V,be=new Qo,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Se=!1;function Ce(){return M===null?le:1}let P=n;function we(e,n){return t.getContext(e,n)}let Te,Ee,F,De,I,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,Je,!1),t.addEventListener(`webglcontextrestored`,Ye,!1),t.addEventListener(`webglcontextcreationerror`,Xe,!1),P===null){let t=`webgl2`;if(P=we(t,e),P===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ke()}catch(e){throw t.removeEventListener(`webglcontextlost`,Je,!1),t.removeEventListener(`webglcontextrestored`,Ye,!1),t.removeEventListener(`webglcontextcreationerror`,Xe,!1),z(`WebGLRenderer: `+e.message),e}function Ke(){Te=new xp(P),Te.init(),Ue=new Gh(P,Te),Ee=new Xf(P,Te,e,Ue),F=new Uh(P,Te),Ee.reversedDepthBuffer&&d&&F.buffers.depth.setReversed(!0),O=P.createFramebuffer(),k=P.createFramebuffer(),A=P.createFramebuffer(),De=new wp(P),I=new Ch,Oe=new Wh(P,Te,F,I,Ee,Ue,De),ke=new bp(T),Ae=new Vf(P),We=new Jf(P,Ae),je=new Sp(P,Ae,De,We),Me=new Ep(P,je,Ae,We,De),Be=new Tp(P,Ee,Oe),Le=new Zf(I),Ne=new Sh(T,ke,Te,Ee,We,Le),Pe=new Qh(T,I),Fe=new Dh,Ie=new Ph(Te),ze=new qf(T,ke,F,Me,p,s),Re=new Hh(T,Me,Ee),Ge=new $h(P,De,Ee,F),Ve=new Yf(P,Te,De),He=new Cp(P,Te,De),De.programs=Ne.programs,T.capabilities=Ee,T.extensions=Te,T.properties=I,T.renderLists=Fe,T.shadowMap=Re,T.state=F,T.info=De}m!==1009&&(w=new Op(m,t.width,t.height,o,r,i));let qe=new Yh(T,P);this.xr=qe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return le},this.setPixelRatio=function(e){e!==void 0&&(le=e,this.setSize(N,ce,!1))},this.getSize=function(e){return e.set(N,ce)},this.setSize=function(e,n,r=!0){qe.isPresenting?R(`WebGLRenderer: Can't change size while VR device is presenting.`):(N=e,ce=n,t.width=Math.floor(e*le),t.height=Math.floor(n*le),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(N*le,ce*le).floor()},this.setDrawingBufferSize=function(e,n,r){N=e,ce=n,le=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)z(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){R(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(re)},this.getViewport=function(e){return e.copy(fe)},this.setViewport=function(e,t,n,r){e.isVector4?fe.set(e.x,e.y,e.z,e.w):fe.set(e,t,n,r),F.viewport(re.copy(fe).multiplyScalar(le).round())},this.getScissor=function(e){return e.copy(pe)},this.setScissor=function(e,t,n,r){e.isVector4?pe.set(e.x,e.y,e.z,e.w):pe.set(e,t,n,r),F.scissor(ie.copy(pe).multiplyScalar(le).round())},this.getScissorTest=function(){return me},this.setScissorTest=function(e){F.setScissorTest(me=e)},this.setOpaqueSort=function(e){ue=e},this.setTransparentSort=function(e){de=e},this.getClearColor=function(e){return e.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=ze.getClearColor(),r=ze.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,P.clearBufferuiv(P.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,P.clearBufferiv(P.COLOR,0,v))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Je,!1),t.removeEventListener(`webglcontextrestored`,Ye,!1),t.removeEventListener(`webglcontextcreationerror`,Xe,!1),ze.dispose(),Fe.dispose(),Ie.dispose(),I.dispose(),ke.dispose(),Me.dispose(),We.dispose(),Ge.dispose(),Ne.dispose(),qe.dispose(),qe.removeEventListener(`sessionstart`,rt),qe.removeEventListener(`sessionend`,it),at.stop()};function Je(e){e.preventDefault(),vo(`WebGLRenderer: Context Lost.`),E=!0}function Ye(){vo(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Re.enabled,n=Re.autoUpdate,r=Re.needsUpdate,i=Re.type;Ke(),De.autoReset=e,Re.enabled=t,Re.autoUpdate=n,Re.needsUpdate=r,Re.type=i}function Xe(e){z(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ze(e){let t=e.target;t.removeEventListener(`dispose`,Ze),Qe(t)}function Qe(e){$e(e),I.remove(e)}function $e(e){let t=I.get(e).programs;t!==void 0&&(t.forEach(function(e){Ne.releaseProgram(e)}),e.isShaderMaterial&&Ne.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=xe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ht(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=je.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;We.setup(i,r,s,n,c);let h,g=Ve;if(c!==null&&(h=Ae.get(c),g=He,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ae.get(c).bytesPerElement:1,o=I.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function et(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ge===!0&&Le.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,dt(e,t,r),e.side=0,e.needsUpdate=!0,dt(e,t,r),e.side=2):dt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Ie.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),_e=this.localClippingEnabled,ge=Le.init(this.clippingPlanes,_e),ge===!0&&Le.setGlobalState(this.clippingPlanes,t),D!==null&&Re.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];et(o,n,t,e),r.add(o)}else et(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=I.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let tt=null;function nt(e){tt&&tt(e)}function rt(){at.stop()}function it(){at.start()}let at=new Bf;at.setAnimationLoop(nt),typeof self<`u`&&at.setContext(self),this.setAnimationLoop=function(e){tt=e,qe.setAnimationLoop(e),e===null?at.stop():at.start()},qe.addEventListener(`sessionstart`,rt),qe.addEventListener(`sessionend`,it),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){z(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=qe.enabled===!0&&qe.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(t),t=qe.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=Ie.get(e,C.length),x.init(t),x.state.textureUnits=Oe.getTextureUnits(),C.push(x),ve.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),he.setFromProjectionMatrix(ve,fo,t.reversedDepth),_e=this.localClippingEnabled,ge=Le.init(this.clippingPlanes,_e),b=Fe.get(e,S.length),b.init(),S.push(b),qe.enabled===!0&&qe.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ot(e,t,-1/0,T.sortObjects)}ot(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(ue,de),Se=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,Se&&ze.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ge===!0&&Le.beginShadows();let i=x.state.shadowsArray;if(Re.render(i,e,t),ge===!0&&Le.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ct(n,r,e,a)}Se&&ze.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];st(b,e,n,n.viewport)}}else r.length>0&&ct(n,r,e,t),Se&&ze.render(e),st(b,e,t)}M!==null&&ee===0&&(Oe.updateMultisampleRenderTarget(M),Oe.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),We.resetDefaultState(),te=-1,ne=null,C.pop(),C.length>0?(x=C[C.length-1],Oe.setTextureUnits(x.state.textureUnits),ge===!0&&Le.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ot(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(he)){r&&be.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ve);let i=Me.update(e),a=e.material;a.visible&&b.push(e,i,a,n,be.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(he))){let i=Me.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),be.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),be.copy(e.boundingSphere.center)),be.applyMatrix4(e.matrixWorld).applyMatrix4(ve)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,be.z,s,t)}}else a.visible&&b.push(e,i,a,n,be.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ot(i[e],t,n,r)}function st(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ge===!0&&Le.setGlobalState(T.clippingPlanes,n),r&&F.viewport(re.copy(r)),i.length>0&&lt(i,t,n),a.length>0&&lt(a,t,n),o.length>0&&lt(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function ct(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new es(1,1,{generateMipmaps:!0,type:e?$i:Ki,minFilter:Gi,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Vo.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||re;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(oe),se=T.getClearAlpha(),se<1&&T.setClearColor(16777215,.5),T.clear(),Se&&ze.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ge===!0&&Le.setGlobalState(T.clippingPlanes,r),lt(e,n,r),Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ut(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(oe,se),d!==void 0&&(r.viewport=d),T.toneMapping=u}function lt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ut(o,t,n,s,l,c)}}function ut(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function dt(e,t,n){t.isScene!==!0&&(t=xe);let r=I.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ne.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ne.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ke.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ze),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return pt(e,s),d}else s.uniforms=Ne.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ne.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Le.uniform),pt(e,s),r.needsLights=_t(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ft(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Fm.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function pt(e,t){let n=I.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function mt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function ht(e,t,n,r,i){t.isScene!==!0&&(t=xe),Oe.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Vo.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ke.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=I.get(r),y=x.state.lights;if(ge===!0&&(_e===!0||e!==ne)){let t=e===ne&&r.id===te;Le.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Le.numPlanes||v.numIntersection!==Le.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=dt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(F.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==te&&(te=r.id,w=!0),v.needsLights){let e=mt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ne!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(P,`projectionMatrix`,e.projectionMatrix),O.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(P,ye.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),ne!==e&&(ne=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(P,`sunShadowMap`,y.state.sunShadowMap,Oe),y.state.directionalShadowMap.length>0&&O.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,Oe),y.state.spotShadowMap.length>0&&O.setValue(P,`spotShadowMap`,y.state.spotShadowMap,Oe),y.state.pointShadowMap.length>0&&O.setValue(P,`pointShadowMap`,y.state.pointShadowMap,Oe)),i.isSkinnedMesh){O.setOptional(P,i,`bindMatrix`),O.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(P,`boneTexture`,e.boneTexture,Oe))}i.isBatchedMesh&&(O.setOptional(P,i,`batchingTexture`),O.setValue(P,`batchingTexture`,i._matricesTexture,Oe),O.setOptional(P,i,`batchingIdTexture`),O.setValue(P,`batchingIdTexture`,i._indirectTexture,Oe),O.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(P,`batchingColorTexture`,i._colorsTexture,Oe));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Be.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=ng()),w){if(O.setValue(P,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&gt(k,E),a&&r.fog===!0&&Pe.refreshFogUniforms(k,a),Pe.refreshMaterialUniforms(k,r,le,ce,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Fm.upload(P,ft(v),k,Oe)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Fm.upload(P,ft(v),k,Oe),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(P,`center`,i.center),O.setValue(P,`modelViewMatrix`,i.modelViewMatrix),O.setValue(P,`normalMatrix`,i.normalMatrix),O.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ge.update(n,S),Ge.bind(n,S)}}return S}function gt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function _t(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=I.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),I.get(e.texture).__webglTexture=t,I.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=I.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=I.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest,F.viewport(re),F.scissor(ie),F.setScissorTest(ae),te=-1;return}if(o.__webglFramebuffer===void 0)Oe.setupRenderTarget(e);else if(o.__hasExternalTextures)Oe.rebindTextures(e,I.get(e.texture).__webglTexture,I.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&I.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Oe.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=I.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Oe.useMultisampledRTT(e)===!1?I.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest}else re.copy(fe).multiplyScalar(le).floor(),ie.copy(pe).multiplyScalar(le).floor(),ae=me;if(n!==0&&(r=O),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(re),F.scissor(ie),F.setScissorTest(ae),i){let r=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=I.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}te=-1};function vt(e){let t=I.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let u=vt(o);if(u.__formatReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Ue.convert(c),Ue.convert(l),a)}finally{let e=M===null?null:I.get(M).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let d=vt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,Ue.convert(l),Ue.convert(u),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let p=M===null?null:I.get(M).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,p);let m=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await xo(P,m,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(f),P.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Oe.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ue.convert(t.format),_=Ue.convert(t.type),v;t.isData3DTexture?(Oe.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Oe.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(Oe.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=I.get(e),r=I.get(t),h=I.get(n.__renderTarget),g=I.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||I.has(e)){let n=I.get(e),r=I.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,k),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){I.get(e).__webglFramebuffer===void 0&&Oe.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Oe.setTextureCube(e,0):e.isData3DTexture?Oe.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Oe.setTexture2DArray(e,0):Oe.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,F.reset(),We.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return fo}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vo._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vo._getUnpackColorSpace()}},ig={ring:new md(.86,1,48),disc:new Wl(1,40),tube:new Gl(1,1,1,14,1,!0),rod:new Gl(1,1,1,5,1),shard:new fd(1,0),ball:new dd(1,1),petal:new pd(1,.6),cube:new Ul(1,1,1)};for(let e of Object.values(ig))e.userData.shared=!0;function ag(e,t=1,n=!0){return new Gc({color:e,transparent:!0,opacity:t,depthWrite:!1,side:2,blending:n?2:1})}var og=class{scene;ground;list=[];sparks=[];sparkMats=new Map;constructor(e,t){this.scene=e,this.ground=t}update(e){for(let t=this.list.length-1;t>=0;t--)this.list[t].update(e)||(this.list[t].dispose(),this.list.splice(t,1));for(let t=this.sparks.length-1;t>=0;t--){let n=this.sparks[t];n.life-=e,n.v.y-=n.gravity*e,n.m.position.addScaledVector(n.v,e),n.m.rotation.x+=n.spin*e,n.m.rotation.z+=n.spin*.7*e,n.m.scale.setScalar(n.size*Math.max(0,Math.min(1,n.life/n.total+.15))),n.life<=0&&(this.scene.remove(n.m),this.sparks.splice(t,1))}}clear(){for(let e of this.list)e.dispose();this.list.length=0;for(let e of this.sparks)this.scene.remove(e.m);this.sparks.length=0}warmObjects(){return[ag(16777215),ag(16777215,1,!1)].map(e=>new W(ig.ball,e))}y(e,t=.07){return this.ground(e.x,e.z)+t}add(e,t,n,r){let i=0;for(let t of e)this.scene.add(t);this.list.push({update:e=>(i+=e,n(Math.min(1,i/r),e)!==!1&&i<r),dispose:()=>{for(let t of e)this.scene.remove(t);for(let e of t)e.dispose()}})}burst(e,t,n,r={}){let i=`${t}:${r.additive!==!1}`,a=this.sparkMats.get(i);a||this.sparkMats.set(i,a=ag(t,.95,r.additive!==!1));let o=e.y??this.y(e,.9);for(let t=0;t<n;t++){let t=new W(ig[r.shape??`ball`],a),n=Math.random()*Math.PI*2,i=(r.speed??3)*(.4+Math.random()*.8),s=r.spread??0;t.position.set(e.x+Math.sin(n)*s*Math.random(),o,e.z+Math.cos(n)*s*Math.random());let c=(r.life??.6)*(.6+Math.random()*.6),l=(r.size??.09)*(.7+Math.random()*.6);t.scale.setScalar(l),this.scene.add(t),this.sparks.push({m:t,v:new V(Math.sin(n)*i,(r.up??2)*(.5+Math.random()),Math.cos(n)*i),life:c,total:c,gravity:r.gravity??6,spin:(Math.random()-.5)*12,size:l})}}ring(e,t,n,r,i=.45,a=.09){let o=ag(t,.9),s=new W(ig.ring,o);s.rotation.x=-Math.PI/2,s.position.set(e.x,this.y(e,a),e.z),this.add([s],[o],e=>{let t=n+(r-n)*(1-(1-e)**2);s.scale.set(t,t,1),o.opacity=.9*(1-e)},i)}disc(e,t,n,r,i=.35,a=0){let o=ag(t,0),s=ag(t,0),c=new W(ig.disc,o),l=new W(ig.ring,s),u=new H,d=ag(t,0);if(a)for(let e=0;e<6;e++){let t=new W(ig.cube,d),r=e/6*Math.PI*2;t.position.set(Math.sin(r)*n*.72,0,Math.cos(r)*n*.72),t.scale.set(n*.16,.02,n*.05),t.rotation.y=r,u.add(t)}for(let t of[c,l])t.rotation.x=-Math.PI/2,t.position.set(e.x,this.y(e,.08),e.z),t.scale.set(n,n,1);u.position.set(e.x,this.y(e,.1),e.z);let f=!1;return this.add([c,l,u],[o,s,d],(e,t)=>{let n=Math.min(1,e*r*5,(1-e)*r*4);return o.opacity=i*n,s.opacity=Math.min(1,i*2.4)*n,d.opacity=.8*n,u.rotation.y+=a*t,!f},r),{end:()=>f=!0}}pillar(e,t,n=3,r=.55,i=.7){let a=ag(t,.6),o=new W(ig.tube,a),s=this.y(e,0);this.add([o],[a],t=>{let i=Math.min(1,t*3);o.scale.set(r*(1-t*.5),n*i,r*(1-t*.5)),o.position.set(e.x,s+n*i/2,e.z),a.opacity=.6*(1-t)},i)}cone(e,t,n,r,i,a=.5){let o=new Wl(n,24,Math.PI/2-r,r*2),s=ag(i,.55),c=new W(o,s);c.rotation.x=Math.PI/2;let l=new H;l.position.set(e.x,this.y(e,.12),e.z),l.rotation.y=t,l.add(c),this.add([l],[s],e=>{c.scale.setScalar(.3+.7*Math.min(1,e*3)),s.opacity=.55*(1-e)},a);let u=this.list.at(-1),d=u.dispose;u.dispose=()=>{d(),o.dispose()};for(let a=0;a<26;a++){let o=t+(Math.random()*2-1)*r,s=.4+Math.random()*.6,c=n*(1.6+Math.random()),l={x:e.x+Math.sin(o)*s,z:e.z+Math.cos(o)*s},u=`${a%3?i:16769162}:true`,d=this.sparkMats.get(u);d||this.sparkMats.set(u,d=ag(a%3?i:16769162,.95));let f=new W(ig.ball,d);f.position.set(l.x,this.y(l,.7),l.z);let p=.12+Math.random()*.14;this.scene.add(f),this.sparks.push({m:f,v:new V(Math.sin(o)*c,.6+Math.random(),Math.cos(o)*c),life:.35,total:.35,gravity:-2,spin:6,size:p})}}bolt(e,t,n=.35){let r=new H,i=ag(t,1),a=ag(16777215,1);for(let t=0;t<e.length-1;t++){let n=e[t],o=e[t+1],s=this.y(n,1.1),c=this.y(o,1.1),l=Math.max(2,Math.round(Math.hypot(o.x-n.x,o.z-n.z)/.8)),u=new V(n.x,s,n.z);for(let e=1;e<=l;e++){let t=e/l,d=e===l?0:.35,f=new V(n.x+(o.x-n.x)*t+(Math.random()-.5)*d,s+(c-s)*t+(Math.random()-.5)*d,n.z+(o.z-n.z)*t+(Math.random()-.5)*d);for(let[e,t]of[[i,.07],[a,.025]]){let n=new W(ig.rod,e),i=u.distanceTo(f);n.scale.set(t,i,t),n.position.copy(u).lerp(f,.5),n.quaternion.setFromUnitVectors(new V(0,1,0),f.clone().sub(u).normalize()),r.add(n)}u=f}}this.add([r],[i,a],e=>{let t=e<.5?Math.random()<.7?1:.3:1-e;i.opacity=t,a.opacity=t},n)}meteor(e,t,n){let r=this.disc(e,16726810,3,t+.15,.28),i=ag(16742954,1),a=ag(16773296,1,!1),o=new H,s=new W(ig.ball,i),c=new W(ig.shard,a);s.scale.setScalar(.75),c.scale.setScalar(.45),o.add(s,c);let l=this.y(e,.4),u=new V(e.x-6,l+16,e.z-3),d=!1;this.add([o],[i,a],t=>{let i=t*t;o.position.set(u.x+(e.x-u.x)*i,u.y+(l-u.y)*i,u.z+(e.z-u.z)*i),o.rotation.x+=.3,Math.random()<.9&&this.burst({x:o.position.x,y:o.position.y,z:o.position.z},Math.random()<.5?16742954:16765562,2,{speed:.6,up:.4,gravity:0,life:.45,size:.22}),t>=1&&!d&&(d=!0,r.end(),n())},t)}rain(e,t,n,r){let i=0,a=0,o=n===`ice`?34:22;this.list.push({update:s=>{for(i+=s,a+=s*o;a>=1;){a--;let r=Math.random()*Math.PI*2,i=Math.sqrt(Math.random())*t,o={x:e.x+Math.sin(r)*i,z:e.z+Math.cos(r)*i},s=n===`ice`?Math.random()<.5?14219007:9427199:[16230616,16765418,16773800,12187034][Math.floor(Math.random()*4)];this.burst({x:o.x,y:this.y(o,n===`ice`?5:4),z:o.z},s,1,{speed:n===`ice`?.4:.8,up:n===`ice`?-6:-1.4,gravity:n===`ice`?8:.6,life:n===`ice`?.6:1.6,size:n===`ice`?.16:.2,shape:n===`ice`?`shard`:`petal`,additive:n===`ice`})}return i<r},dispose:()=>{}})}bubble(e,t,n,r=.95){let i=ag(t,.25),a=new W(ig.ball,i),o=!1;return this.add([a],[i],t=>{let s=e();if(!s||o)return!1;a.position.set(s.x,this.y(s,.9),s.z),a.scale.setScalar(r*(1+Math.sin(t*n*6)*.04)),i.opacity=.25*Math.min(1,(1-t)*n*2)},n),{end:()=>o=!0}}iceBlock(e,t,n=1){let r=ag(12578815,.42,!1),i=new W(ig.cube,r);this.add([i],[r],a=>{let o=e();if(!o)return!1;i.position.set(o.x,this.y(o,.75*n),o.z),i.scale.set(1.1*n,1.6*n,1.1*n),i.rotation.y=.4,r.opacity=.42*Math.min(1,(1-a)*t*3)},t)}},sg=Math.PI/180;function cg(e,t,n){let r=Math.floor(e/864e5)-10957+8e-4-n/360,i=(357.5291+.98560028*r)%360,a=(i+(1.9148*Math.sin(i*sg)+.02*Math.sin(2*i*sg)+3e-4*Math.sin(3*i*sg))+180+102.9372)%360,o=2451545+r+.0053*Math.sin(i*sg)-.0069*Math.sin(2*a*sg),s=Math.asin(Math.sin(a*sg)*Math.sin(23.44*sg)),c=(Math.sin(-.833*sg)-Math.sin(t*sg)*Math.sin(s))/(Math.cos(t*sg)*Math.cos(s)),l=e=>(e-2440587.5)*864e5;if(c>1)return{rise:1/0,set:-1/0};if(c<-1)return{rise:-1/0,set:1/0};let u=Math.acos(c)/sg;return{rise:l(o-u/360),set:l(o+u/360)}}var lg=36e5;function ug(e,t,n){for(let r of[0,-1,1]){let{rise:i,set:a}=cg(e+r*864e5,t,n);if(i===-1/0)return`day`;if(i!==1/0){if(Math.abs(e-i)<=lg/2||Math.abs(e-a)<=lg/2)return`twilight`;if(e>i+lg/2&&e<a-lg/2)return`day`}}return`night`}var dg={day:{sun:2.3,sunColor:16770239,sky:1.45,skyColor:15660031,ground:6714506,fog:13622464,lamp:0},twilight:{sun:1.3,sunColor:16757642,sky:1.3,skyColor:15845048,ground:5918570,fog:13216164,lamp:1.2},night:{sun:.75,sunColor:10466534,sky:1.7,skyColor:7375040,ground:2899299,fog:1780298,lamp:2.6}},fg=.6,pg=.5,mg=1.5,hg=`https://s3.amazonaws.com/elevation-tiles-prod/terrarium`;function gg(){return(typeof location>`u`?null:new URLSearchParams(location.search).get(`terrain`))||hg}var _g=e=>5*Math.asinh(e/12)*fg,vg=async e=>{let t=await fetch(e,{signal:AbortSignal.timeout(12e3)});if(!t.ok)return null;let n=await createImageBitmap(await t.blob()),r=new OffscreenCanvas(n.width,n.height).getContext(`2d`);r.drawImage(n,0,0);let i=r.getImageData(0,0,n.width,n.height).data,a=new Float32Array(n.width*n.height);for(let e=0;e<a.length;e++)a[e]=i[e*4]*256+i[e*4+1]+i[e*4+2]/256-32768;return a},yg=class{tiles=new Map;ready=new Map;decode;constructor(e=vg){this.decode=e}key(e,t){return`12/${e}/${t}`}load(e,t){let n=this.key(e,t),r=this.tiles.get(n);return r||(r=this.decode(`${gg()}/${n}.png`).catch(()=>null),r.then(e=>this.ready.set(n,e)),this.tiles.set(n,r)),r}async ensure(e){let t=4096,n=e=>Math.floor((An(e)+180)/360*t),r=e=>Math.floor((1-Math.asinh(Math.tan(e*Math.PI/180))/Math.PI)/2*t),i=[];for(let a=n(e.west);a<=n(e.east);a++)for(let n=r(e.north);n<=r(e.south);n++)i.push(this.load((a%t+t)%t,n));await Promise.all(i)}at(e){let t=4096,n=(An(e.lon)+180)/360*t*256,r=(1-Math.asinh(Math.tan(e.lat*Math.PI/180))/Math.PI)/2*t*256,i=(e,n)=>{let r=Math.floor(e/256),i=Math.floor(n/256),a=this.ready.get(this.key((r%t+t)%t,i));return a?a[(Math.floor(n)-i*256)*256+(Math.floor(e)-r*256)]:null},a=Math.floor(n-.5),o=Math.floor(r-.5),s=n-.5-a,c=r-.5-o,l=i(a,o),u=i(a+1,o),d=i(a,o+1),f=i(a+1,o+1);return l===null||u===null||d===null||f===null?null:(l*(1-s)+u*s)*(1-c)+(d*(1-s)+f*s)*c}};function bg(e,t,n,r=pg){for(let i=0;i<6;i++){let i=!1;for(let a=0;a<n;a++)for(let n=0;n<t;n++){let o=a*t+n,s=e[o];n>0&&(s=Math.min(s,e[o-1]+r)),a>0&&(s=Math.min(s,e[o-t]+r)),s<e[o]-1e-6&&(e[o]=s,i=!0)}for(let a=n-1;a>=0;a--)for(let o=t-1;o>=0;o--){let s=a*t+o,c=e[s];o<t-1&&(c=Math.min(c,e[s+1]+r)),a<n-1&&(c=Math.min(c,e[s+t]+r)),c<e[s]-1e-6&&(e[s]=c,i=!0)}if(!i)break}return e}function xg(e,t,n,r){let i=new Float32Array(e.length),a=r*2+1;for(let o=0;o<n;o++)for(let n=0;n<t;n++){let s=0;for(let i=-r;i<=r;i++)s+=e[o*t+Math.min(t-1,Math.max(0,n+i))];i[o*t+n]=s/a}for(let o=0;o<n;o++)for(let s=0;s<t;s++){let c=0;for(let e=-r;e<=r;e++)c+=i[Math.min(n-1,Math.max(0,o+e))*t+s];e[o*t+s]=c/a}return e}var Sg=(e,t)=>{let n=Math.imul(e|0,374761393)+Math.imul(t|0,668265263)|0;return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296};function Cg(e,t){let n=0,r=1,i=0;for(let a=0;a<2;a++){let o=(1<<a)/260,s=e*o,c=t*o,l=Math.floor(s),u=Math.floor(c),d=s-l,f=c-u,p=d*d*(3-2*d),m=f*f*(3-2*f),h=Sg(l+a*101,u),g=Sg(l+1+a*101,u),_=Sg(l+a*101,u+1),v=Sg(l+1+a*101,u+1);n+=r*((h*(1-p)+g*p)*(1-m)+(_*(1-p)+v*p)*m),i+=r,r*=.45}return n/i*2-1}var wg=class{x0=0;z0=0;w=0;v=new Float32Array;wet=new Uint8Array;waterLevel=0;version=0;at(e,t){let n=this.w;if(!n)return 0;let r=Math.min(n-1,Math.max(0,(e-this.x0)/2-.5)),i=Math.min(n-1,Math.max(0,(t-this.z0)/2-.5)),a=Math.min(n-2,Math.floor(r)),o=Math.min(n-2,Math.floor(i)),s=r-a,c=i-o,l=this.v,u=l[o*n+a],d=l[o*n+a+1],f=l[(o+1)*n+a],p=l[(o+1)*n+a+1];return s+c<=1?u+(d-u)*s+(f-u)*c:p+(f-p)*(1-s)+(d-p)*(1-c)}low(){let e=0;for(let t=0;t<this.v.length;t++)e=Math.min(e,this.v[t]);return e}build(e,t,n,r,i,a,o){let s=Math.ceil(t*2/2),c=Math.floor((e.x-t)/2)*2,l=Math.floor((e.z-t)/2)*2,u=new Float32Array(s*s),d=(e,t)=>({x:c+(e+.5)*2,z:l+(t+.5)*2}),f=0;for(let e=0;e<s;e++)for(let t=0;t<s;t++){let a=i.at(Mn(d(t,e),n));a!==null&&f++,u[e*s+t]=a===null?0:_g(a-r)}if(f<s*s*.5)return!1;let p=new Uint8Array(s*s),m=1/0;for(let e=0;e<s;e++)for(let t=0;t<s;t++)a(d(t,e))&&(p[e*s+t]=1,m=Math.min(m,u[e*s+t]));let h=()=>{if(m<1/0)for(let e=0;e<s*s;e++)p[e]&&(u[e]=m)};h();let g=new Uint8Array(s*s);g.set(p);let _=(e,t,n)=>{let r=Math.floor((e-n-c)/2),i=Math.floor((e+n-c)/2),a=Math.floor((t-n-l)/2),o=Math.floor((t+n-l)/2);for(let e=Math.max(0,a);e<=Math.min(s-1,o);e++)for(let t=Math.max(0,r);t<=Math.min(s-1,i);t++)g[e*s+t]=1},v=c+s*2,y=l+s*2;for(let e of o?.roads??[])for(let t=1;t<e.pts.length;t++){let[n,r]=e.pts[t-1],[i,a]=e.pts[t];if(Math.max(n,i)<c||Math.min(n,i)>v||Math.max(r,a)<l||Math.min(r,a)>y)continue;let o=Math.max(1,Math.ceil(Math.hypot(i-n,a-r)/1));for(let t=0;t<=o;t++)_(n+(i-n)*t/o,r+(a-r)*t/o,e.width/2)}for(let e of o?.buildings??[]){let t=e.rings[0],n=1/0,r=-1/0,i=1/0,a=-1/0;for(let[e,o]of t)n=Math.min(n,e),r=Math.max(r,e),i=Math.min(i,o),a=Math.max(a,o);r<c||n>v||a<l||i>y||_((n+r)/2,(i+a)/2,Math.max(r-n,a-i)/2)}let b=new Float32Array(s*s);for(let e=0;e<s*s;e++)b[e]=g[e]?0:99;for(let e=0;e<s;e++)for(let t=0;t<s;t++){let n=e*s+t;t&&(b[n]=Math.min(b[n],b[n-1]+1)),e&&(b[n]=Math.min(b[n],b[n-s]+1))}for(let e=s-1;e>=0;e--)for(let t=s-1;t>=0;t--){let n=e*s+t;t<s-1&&(b[n]=Math.min(b[n],b[n+1]+1)),e<s-1&&(b[n]=Math.min(b[n],b[n+s]+1))}let x=_g(mg)-_g(0);for(let e=0;e<s;e++)for(let t=0;t<s;t++){let r=e*s+t,i=Math.min(1,b[r]/3);if(!i)continue;let a=Mn(d(t,e),n),o=a.lon*111320*Math.cos(n.lat*Math.PI/180),c=a.lat*110540;u[r]+=Cg(o,c)*x*i}if(bg(u,s,s),xg(u,s,s,2),h(),m<1/0)for(let e=0;e<s*s;e++)p[e]||(u[e]=Math.max(u[e],m+.02));return Object.assign(this,{x0:c,z0:l,w:s,v:u,wet:p,waterLevel:m<1/0?m:0}),this.version++,!0}};function Tg(e){let t=e.areas.filter(e=>e.water).map(e=>{let t=e.rings[0];return{r:t,x0:Math.min(...t.map(e=>e[0])),x1:Math.max(...t.map(e=>e[0])),z0:Math.min(...t.map(e=>e[1])),z1:Math.max(...t.map(e=>e[1]))}});return e=>t.some(t=>{if(e.x<t.x0||e.x>t.x1||e.z<t.z0||e.z>t.z1)return!1;let n=!1;for(let r=0,i=t.r.length-1;r<t.r.length;i=r++){let a=t.r[r],o=t.r[i];a[1]>e.z!=o[1]>e.z&&e.x<(o[0]-a[0])*(e.z-a[1])/(o[1]-a[1])+a[0]&&(n=!n)}return n})}var Eg=5e-4,Dg=.7;function Og(e){let t=Math.floor((e.lat+90)/Eg),n=-90+(t+.5)*Eg,r=Math.max(1,Math.ceil(360*Math.max(1e-5,Math.cos(n*Math.PI/180))/Eg));return`${Math.floor((An(e.lon)+180)/360*r)%r}:${t}`}function kg(e,t,n=150){let r=0,i=n/111320,a=n/(111320*Math.max(1e-5,Math.cos(t.lat*Math.PI/180))),o=Eg/2;for(let n=-i;n<=i;n+=o)for(let s=-a;s<=a;s+=a/i*o){if((n/i)**2+(s/a)**2>1)continue;let o=Og({lat:t.lat+n,lon:t.lon+s});e.has(o)||(e.add(o),r++)}return r}function Ag(e,t,n,r=Dg){let i=.3*e+.59*t+.11*n;return[e+(i-e)*r,t+(i-t)*r,n+(i-n)*r]}var jg=`https://api.open-meteo.com/v1/forecast`,Mg=18e5;function Ng(e,t=0){return e>=95?`storm`:e>=71&&e<=77||e===85||e===86?`snow`:e>=51&&e<=67||e>=80&&e<=82?`rain`:e===45||e===48?`fog`:t>=10?`wind`:`clear`}var Pg=(e,t)=>`ropexpanse:weather:${Math.round(e*4)}:${Math.round(t*4)}`;async function Fg(e,t,n=Date.now(),r=fetch){let i=Pg(e,t);try{let e=JSON.parse(localStorage.getItem(i)??`null`);if(e&&n-e.at<Mg)return e.weather}catch{}try{let a=await r(`${jg}?latitude=${e.toFixed(2)}&longitude=${t.toFixed(2)}&current=weather_code,wind_speed_10m&wind_speed_unit=ms`,{signal:AbortSignal.timeout(8e3)});if(!a.ok)return`clear`;let o=await a.json(),s=Ng(Number(o?.current?.weather_code??0),Number(o?.current?.wind_speed_10m??0));try{localStorage.setItem(i,JSON.stringify({at:n,weather:s}))}catch{}return s}catch{return`clear`}}var Ig={clear:`Pogodnie`,rain:`Deszcz`,snow:`Śnieg`,fog:`Mgła`,storm:`Burza`,wind:`Wiatr`},Lg=(e,t,n,r,i,a,o,s=1,c={})=>({id:e,name:t,biome:n,rank:r,behavior:i,look:a,color:o,size:s,...c}),Rg=[Lg(`wilk`,`Wilk`,`las`,`weak`,`pack`,`wolf`,9080723,.9),Lg(`dzik`,`Dzik`,`las`,`medium`,`charge`,`wolf`,4928547,1.1),Lg(`pajak`,`Pająk leśny`,`las`,`medium`,`ambush`,`wolf`,3099178,.9),Lg(`leszy`,`Leszy`,`las`,`elite`,`summoner`,`person`,5981744,1.3),Lg(`szczur`,`Szczur polny`,`laki`,`weak`,`pack`,`wolf`,8022616,.55),Lg(`strach`,`Strach na wróble`,`laki`,`medium`,`shooter`,`archer`,13215834),Lg(`bandyta_polny`,`Bandyta polny`,`laki`,`medium`,`charge`,`person`,10255178),Lg(`poludnica`,`Południca`,`laki`,`elite`,`whirl`,`person`,15920608,1.3,{when:[`day`]}),Lg(`rak`,`Rak`,`woda`,`weak`,`pack`,`wolf`,10369834,.55),Lg(`topielec`,`Topielec`,`woda`,`medium`,`ambush`,`person`,6262650),Lg(`kumak`,`Żaba-kumak`,`woda`,`medium`,`shooter`,`wolf`,6126138,.7),Lg(`wodnik`,`Wodnik`,`woda`,`elite`,`caster`,`person`,4026246,1.25),Lg(`szkielet`,`Szkielet`,`cmentarz`,`weak`,`pack`,`person`,15131087,.95),Lg(`upior`,`Upiór`,`cmentarz`,`medium`,`caster`,`person`,11053232),Lg(`nekromanta`,`Nekromanta`,`cmentarz`,`elite`,`summoner`,`person`,2499115,1.2),Lg(`strzyga`,`Strzyga`,`cmentarz`,`elite`,`charge`,`person`,9210502,1.2),Lg(`bandyta`,`Bandyta`,`miasto`,`weak`,`pack`,`person`,7035464),Lg(`kusznik`,`Bandyta-kusznik`,`miasto`,`medium`,`shooter`,`archer`,5917242),Lg(`zlodziej`,`Złodziej`,`miasto`,`medium`,`thief`,`person`,3814704,.85),Lg(`herszt`,`Herszt`,`miasto`,`elite`,`colossus`,`person`,7031338,1.45),Lg(`kamyczak`,`Kamyczak`,`przemysl`,`weak`,`pack`,`wolf`,9411232,.6),Lg(`bies`,`Bies kopalni`,`przemysl`,`medium`,`ambush`,`person`,1972762),Lg(`golem`,`Golem`,`przemysl`,`elite`,`colossus`,`person`,8161912,1.6),Lg(`ognik`,`Błędny ognik`,`any`,`weak`,`lure`,`wolf`,10475626,.45,{when:[`twilight`]}),Lg(`nietoperz`,`Nietoperze`,`any`,`weak`,`pack`,`wolf`,3811874,.5,{when:[`twilight`,`night`]}),Lg(`nocnica`,`Nocnica`,`laki`,`elite`,`caster`,`person`,1841702,1.25,{when:[`night`]}),Lg(`wilkolak`,`Wilkołak`,`las`,`elite`,`charge`,`wolf`,7301734,1.6,{when:[`night`]}),Lg(`topielec_deszcz`,`Topielec`,`any`,`medium`,`ambush`,`person`,6262650,1,{weather:[`rain`,`storm`]}),Lg(`upior_lodowy`,`Lodowy upiór`,`any`,`medium`,`caster`,`person`,12575730,1,{weather:[`snow`]}),Lg(`planetnik`,`Płanetnik`,`any`,`elite`,`caster`,`person`,5595246,1.3,{weather:[`storm`]}),Lg(`zmij`,`Żmij`,`any`,`elite`,`charge`,`wolf`,7043642,1.8,{far:!0}),Lg(`licz`,`Licz`,`cmentarz`,`elite`,`summoner`,`person`,5909098,1.35,{far:!0})],zg={las:`wilk`,laki:`szczur`,woda:`rak`,cmentarz:`szkielet`,miasto:`bandyta`,przemysl:`kamyczak`},Bg=e=>Rg.find(t=>t.id===e),Vg={forest:`las`,wood:`las`,scrub:`las`,orchard:`las`,park:`las`,meadow:`laki`,grass:`laki`,grassland:`laki`,farmland:`laki`,village_green:`laki`,allotments:`laki`,green:`laki`,garden:`laki`,cemetery:`cmentarz`,industrial:`przemysl`,quarry:`przemysl`,railway:`przemysl`,construction:`przemysl`,brownfield:`przemysl`,landfill:`przemysl`};function Hg(e,t){for(let n of e.areas){if(!n.water)continue;let e=n.rings[0],r=1/0,i=1/0,a=-1/0,o=-1/0;for(let[t,n]of e)t<r&&(r=t),t>a&&(a=t),n<i&&(i=n),n>o&&(o=n);if(t.x>r-5&&t.x<a+5&&t.z>i-5&&t.z<o+5)return`woda`}return Vg[Si(e,t)??``]??`miasto`}function Ug(e,t,n,r,i,a){let o=t=>(t.biome===e||t.biome===`any`)&&(!t.when||t.when.includes(n))&&(!t.weather||t.weather.includes(r))&&(!t.far||i),s=t===`boss`?`elite`:t,c=Rg.filter(e=>e.rank===s&&o(e));n===`night`&&e===`miasto`&&s===`weak`&&(c=c.concat(Rg.filter(e=>e.id===`zlodziej`)));for(let e of[`medium`,`weak`])c.length||(c=Rg.filter(t=>t.rank===e&&o(t)));return c[Math.floor(a*c.length)%c.length]}var Wg=.003;function Gg(e){return e<150?0:Math.min(.6,(e-150)/1500)}var Kg=e=>Math.min(9,4+Math.floor(e/3));function qg(e,t,n,r,i,a,o=Wg,s=`v1`){let c=o,l=[],d=r/(111320*i)+c,f=Math.floor((t.lat-d+90)/c),p=Math.floor((t.lat+d+90)/c);for(let o=f;o<=p;o++){let d=-90+(o+.5)*c,f=Math.max(1e-5,Math.cos(d*Math.PI/180)),p=Math.max(1,Math.ceil(360*f/c)),m=360/p,h=r/(111320*f*i)+m,g=Math.floor((An(t.lon-h)+180)/m),_=Math.ceil(2*h/m);for(let t=0;t<=_;t++){let i=(g+t)%p,d=`${s}:${i}:${o}`,f=In(d),h=jn({lat:-90+(o+.2+f%61/100)*c,lon:An(-180+(i+.2+(f>>>8)%61/100)*m)},e);u(h,n)<=r&&a(h,f)&&l.push({key:d,x:h.x,z:h.z,seed:f})}}return l}var Jg=e=>(e>>>12)%1e3/1e3,Yg=.004;function Xg(e){return e<100?0:Math.min(.35,(e-100)/2500)}function Zg(e){return{rarityLift:Math.min(1,e/1500),legendChance:e>800?Math.min(.1,.03+(e-800)/2e4):0}}function Qg(e){let t=e.camps.map(e=>({a:e,b:e,r:or.safeRadius}));for(let n of M(e))for(let e=1;e<n.length;e++)t.push({a:n[e-1],b:n[e],r:or.ropeSafeMeters*En});return t}function $g(e){let t=Math.atan2(e.b.z-e.a.z,e.b.x-e.a.x),n=Math.max(16,Math.ceil(Math.PI*e.r/.06)),r=[],i=(t,i)=>{for(let a=0;a<=n;a++){let o=i+Math.PI*a/n;r.push({x:t.x+Math.cos(o)*e.r,z:t.z+Math.sin(o)*e.r})}};i(e.b,t-Math.PI/2),i(e.a,t+Math.PI/2);let a=[];for(let e=0;e<r.length;e++){let t=r[e],n=r[(e+1)%r.length],i=Math.max(1,Math.ceil(u(t,n)/.06));for(let e=0;e<i;e++)a.push({x:t.x+(n.x-t.x)*e/i,z:t.z+(n.z-t.z)*e/i})}return a}var e_=new Gc({color:4640165,transparent:!0,opacity:.18,depthWrite:!0,depthFunc:2,toneMapped:!1,side:2}),t_=[new Gc({color:3599030,transparent:!0,opacity:.22,depthWrite:!1,toneMapped:!1,side:2}),new Gc({color:1195571,depthWrite:!1,toneMapped:!1,side:2}),new Gc({color:7995345,depthWrite:!1,toneMapped:!1,side:2})];function n_(e){let t=new Nc;return t.setAttribute(`position`,new xc(e,3)),t}function r_(e,t){let n=new H,r=Qg(e),i=[],a=[],o=te(e);for(let e of o){let n=e.map(e=>new B(e.x,e.z));for(let r of ad.triangulateShape(n,[]))if(t(r.reduce((t,n)=>({x:t.x+e[n].x/3,z:t.z+e[n].z/3}),{x:0,z:0})))for(let t of r)i.push(e[t].x,.065,e[t].z)}for(let[e,n]of r.entries()){let s=$g(n),c={x:(n.a.x+n.b.x)/2,z:(n.a.z+n.b.z)/2};for(let n=0;n<s.length;n++){let l=s[n],u=s[(n+1)%s.length];if(!t(l)||!t(u))continue;i.push(c.x,.065,c.z,l.x,.065,l.z,u.x,.065,u.z);let d={x:(l.x+u.x)/2,z:(l.z+u.z)/2};!o.some(e=>ne(d,e))&&!r.some((t,n)=>n!==e&&b(d,t.a,t.b)<t.r-.003)&&a.push([l,u])}}let s=new W(n_(i),e_);return s.renderOrder=1,n.add(s),[.42,.24,.13].forEach((e,t)=>{let r=[],i=.075+t*.005;for(let[t,n]of a){let a=u(t,n);if(a<1e-5)continue;let o=-(n.z-t.z)/a*e/2,s=(n.x-t.x)/a*e/2,c=[t.x+o,i,t.z+s],l=[t.x-o,i,t.z-s],d=[n.x+o,i,n.z+s],f=[n.x-o,i,n.z-s];r.push(...c,...l,...d,...l,...f,...d)}let o=new W(n_(r),t_[t]);o.renderOrder=2+t,n.add(o)}),n.traverse(e=>{e.raycast=()=>{}}),n}function i_(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Nc,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=a_(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=a_(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function a_(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new vc(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var o_=new Od({vertexColors:!0,roughness:.88,flatShading:!0});function s_(e){let t=[];e.traverse(e=>{e instanceof H&&t.push(e)});for(let e of t){let t=e.children.filter(e=>e instanceof W);if(t.length<2)continue;let n=t.map(e=>{e.updateMatrix();let t=e.geometry.index?e.geometry.toNonIndexed():e.geometry.clone();t.applyMatrix4(e.matrix),t.deleteAttribute(`uv`);let n=e.material.color,r=new Float32Array(t.attributes.position.count*3);for(let e=0;e<r.length;e+=3)r[e]=n.r,r[e+1]=n.g,r[e+2]=n.b;return t.setAttribute(`color`,new vc(r,3)),t}),r=i_(n);if(r){for(let n of t)e.remove(n),n.geometry.dispose();let n=new W(r,o_);n.receiveShadow=!0,e.add(n)}n.forEach(e=>e.dispose())}}var c_=new Map;function l_(e){let t=c_.get(e);return t||(t=new Od({color:e,roughness:.88,flatShading:!0}),c_.set(e,t)),t}function K(e,t,n,r){let i=new W(new Ul(...n),l_(t));return i.position.set(...r),i.castShadow=!0,i.receiveShadow=!0,e.add(i),i}function u_(e,t,n,r,i=[1,1,1]){let a=new W(new dd(n,1),l_(t));return a.position.set(...r),a.scale.set(...i),a.castShadow=!0,e.add(a),a}function d_(e){return{role:e.role,sex:e.sex,weapon:e.equipment.weapon?.icon,offhand:e.equipment.offhand?.icon,element:ar(e)??void 0}}var f_=.9,p_={warrior:[{tunic:3099246,trim:14263354,shawl:3099246,pants:2042426,extra:`plate`},{tunic:10111530,trim:10133668,shawl:8010274,pants:4862502,extra:`leather`},{tunic:2067094,trim:12107460,shawl:12107460,pants:4864558,extra:`silver`}],archer:[{tunic:4160046,trim:3038754,shawl:3038754,pants:3820074,extra:`cape`},{tunic:8007218,trim:5906982,shawl:6957100,pants:3811878,extra:`cape`},{tunic:4865930,trim:15260864,shawl:3092318,pants:2763332,extra:`cape`}],mage:[{tunic:5974638,trim:14263354,shawl:9064368,pants:3022384,extra:`robe`},{tunic:3103375,trim:10472430,shawl:3103375,pants:1976890,extra:`hood`},{tunic:9054762,trim:14263354,shawl:9054762,pants:3811876,extra:`robe`}],herbalist:[{tunic:6261294,trim:8038458,shawl:8038458,pants:3033634},{tunic:9067050,trim:13802030,shawl:13802030,pants:3811870},{tunic:3042862,trim:5941306,shawl:4889146,pants:1980958}]},m_=[15778970,14262387,11696722,8213048],h_=[3811874,8014372,2367530,5909034,12883015,2763332,4860506,9079428],g_=5913122,__=5913126,v_=8015924,y_=14263354,b_=12107460,x_=9065e3,S_=1972760;function C_(e,t,n,r){let i=new cd(new wu(n.map(([e,t])=>new B(e,t))),{depth:r,bevelEnabled:!1});i.translate(0,0,-r/2);let a=new W(i,l_(t));return a.castShadow=!0,e.add(a),a}function w_(e,t,n,r){let i=new W(new fd(1,0),l_(t));return i.position.set(...n),i.scale.set(...r),i.castShadow=!0,e.add(i),i}function T_(e,t){if(t===`axe`){K(e,x_,[.09,.09,1.15],[0,0,.42]),K(e,9080980,[.13,.13,.1],[0,0,-.12]),K(e,9080980,[.14,.14,.2],[0,0,.88]);for(let t of[-1,1]){let n=C_(e,b_,[[.06,-.12],[.3,-.26],[.44,-.3],[.44,.3],[.3,.26],[.06,.12]],.06);n.rotation.x=Math.PI/2,n.scale.x=t,n.position.z=.88}return}if(t===`hammer`){K(e,x_,[.09,.09,1.05],[0,0,.38]),K(e,9080980,[.12,.12,.12],[0,0,-.14]),K(e,2067094,[.13,.13,.06],[0,0,0]),K(e,b_,[.64,.3,.3],[0,0,.92]),K(e,14080733,[.08,.34,.34],[-.34,0,.92]),K(e,14080733,[.08,.34,.34],[.34,0,.92]);for(let t of[-.18,.18])K(e,2067094,[.06,.32,.32],[t,0,.92]);w_(e,10133668,[0,.16,.92],[.1,.03,.1]);return}K(e,y_,[.12,.12,.08],[0,0,-.1]),K(e,2767450,[.08,.08,.22],[0,0,.04]),K(e,y_,[.46,.1,.12],[0,0,.2]),K(e,b_,[.16,.06,.92],[0,0,.72]),K(e,14672870,[.05,.065,.92],[0,0,.72]);let n=new W(new Kl(.115,.26,4),l_(b_));n.rotation.x=Math.PI/2,n.rotation.y=Math.PI/4,n.scale.set(1,1,.4),n.position.set(0,0,1.31),e.add(n)}function E_(e,t,n){K(e,t===`frost`?2767450:t===`life`?x_:4861986,[.09,1.75,.09],[0,.32,0]);for(let n of[-.5,.62])K(e,t===`life`?8038458:y_,[.13,.07,.13],[0,n,0]);if(t===`life`){if(n===1){K(e,y_,[.26,.08,.26],[0,1.22,0]);let t=new W(new dd(.2,0),l_(9080464));t.position.y=1.4,e.add(t);return}for(let t of[-1,1]){let n=K(e,x_,[.08,.36,.08],[t*.1,1.3,0]);n.rotation.z=-t*.55}let t=w_(e,7319610,[.2,1.56,0],[.12,.24,.04]);t.rotation.z=-.5}else{K(e,y_,[.34,.07,.1],[0,1.2,0]);for(let t of[-1,1])K(e,y_,[.07,.22,.1],[t*.16,1.32,0]);t===`fire`?u_(e,16747050,.17,[0,1.4,0]):t===`frost`?w_(e,9430783,[0,1.42,0],[.11,.26,.11]):t===`storm`?w_(e,10181887,[0,1.42,0],[.12,.26,.12]):u_(e,7529709,.17,[0,1.4,0])}}function D_(e,t){let n=[];for(let e=0;e<=6;e++){let t=-.85+e/6*1.7;n.push(new V(0,t,.08+.3*(1-(t/.85)**2)))}for(let r=0;r<n.length-1;r++){let i=n[r],a=n[r+1],o=K(e,t,[.1,i.distanceTo(a)+.04,.1],[0,(i.y+a.y)/2,(i.z+a.z)/2]);o.rotation.x=Math.atan2(a.z-i.z,a.y-i.y)}K(e,g_,[.13,.24,.13],[0,0,.38]),K(e,14734516,[.02,1.7,.02],[0,0,.08])}function O_(e=`hero`,t=0,n={}){let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H,d=new H;r.add(i),i.position.y=f_;let f=Math.abs(Math.floor(t)),p=n.role===`woodcutter`||n.role===`miner`||n.role===`ropemaker`?`herbalist`:n.role,m=n.sex?n.sex===`f`:f%2==1,h=p===`mage`&&n.element?{storm:0,frost:1,fire:2,life:0}[n.element]:Math.floor(f/2)%3,g=p?p_[p][h]:e===`archer`?p_.archer[f%3]:{tunic:[3432048,7689593,5468232,10183229,4414347,10123334][f%6],trim:g_,shawl:6969924,pants:3423291,extra:`leather`},_=m_[Math.floor(f/6)%m_.length],v=h_[Math.floor(f/3)%h_.length],y=g.extra===`robe`||g.extra===`hood`;for(let[e,t]of[[o,-.2],[s,.2]])r.add(e),e.position.set(t,.56,0),K(e,g.pants,[.3,.26,.32],[0,-.1,0]),K(e,__,[.36,.32,.44],[0,-.4,.04]),K(e,v_,[.4,.08,.46],[0,-.25,.03]),g.extra===`plate`&&K(e,y_,[.26,.14,.06],[0,-.12,.18]),(g.extra===`silver`||g.extra===`leather`)&&K(e,b_,[.38,.1,.44],[0,-.32,.03]);if(K(i,g.tunic,[.8,.62,.48],[0,-.02,0]),K(i,g.tunic,[.86,y?.42:.28,.54],[0,y?-.4:-.3,0]),K(i,g.extra===`silver`?g.tunic:g.trim,[.3,y?.5:.36,.04],[0,y?-.36:-.3,.28]),K(i,g_,[.84,.1,.52],[0,-.16,0]),K(i,y_,[.18,.15,.05],[0,-.16,.27]),K(i,g.tunic,[.08,.07,.06],[0,-.16,.3]),K(i,g_,[.16,.16,.08],[-.24,-.24,.27]),g.extra===`silver`&&(K(i,b_,[.84,.44,.52],[0,.08,0]),K(i,g.tunic,[.3,.2,.04],[0,.22,.27])),g.extra===`leather`||e===`archer`){let e=K(i,3810840,[.1,.8,.04],[0,.05,.25]);e.rotation.z=.7}if(y){for(let e of[-.13,.13])K(i,g.trim,[.06,.62,.04],[e,0,.25]);K(i,g.trim,[.9,.06,.56],[0,-.6,0])}if(K(i,g.shawl,[.92,.16,.58],[0,.26,0]),K(i,g.shawl,[.56,.14,.06],[0,.17,.28]),(y||g.extra===`plate`)&&K(i,g.trim,[.94,.05,.6],[0,.19,0]),y&&w_(i,{5974638:11893503,3103375:9430783,9054762:16747050}[g.tunic]??9430783,[0,.2,.33],[.09,.09,.04]),g.extra===`cape`&&K(i,g.shawl,[.78,.82,.08],[0,-.06,-.29]),e===`archer`||p===`archer`){let e=new H;e.position.set(.18,.08,-.38),e.rotation.z=-.35,i.add(e),K(e,5913122,[.2,.56,.2],[0,0,0]),K(e,g.tunic,[.22,.08,.22],[0,-.06,0]);for(let t of[-.05,0,.05])K(e,6965802,[.025,.22,.025],[t,.36,0]),K(e,15787724,[.05,.1,.05],[t,.48,0])}for(let[e,t]of[[c,-.52],[l,.52]])i.add(e),e.position.set(t,.22,0),K(e,g.tunic,[.26,.26,.28],[0,-.08,0]),K(e,y?g.tunic:15260872,[.24,.14,.26],[0,-.27,0]),K(e,y?g.trim:g.extra===`silver`?b_:g_,[.28,.12,.3],[0,-.38,0]),K(e,_,[.24,.2,.24],[0,-.53,0]),(g.extra===`plate`||g.extra===`silver`||g.extra===`leather`&&p===`warrior`)&&(K(e,g.extra===`plate`?g.tunic:b_,[.36,.16,.38],[t>0?.03:-.03,.06,0]),g.extra===`plate`&&K(e,y_,[.38,.05,.4],[t>0?.03:-.03,-.01,0]));i.add(a),a.position.y=.3,K(a,_,[.9,.84,.82],[0,.44,0]);for(let e of[-.47,.47])K(a,_,[.08,.18,.14],[e,.4,.02]);for(let e of[-.17,.17])K(a,S_,[.075,.16,.03],[e,.46,.415]);if(!m&&(p===`archer`||p===`herbalist`?f%3!=2:f%3==0)){K(a,v,[.92,.32,.12],[0,.17,.4]);for(let e of[-.42,.42])K(a,v,[.1,.42,.5],[e,.3,.12]);K(a,9067076,[.2,.04,.03],[0,.26,.465])}if(g.extra===`hood`){for(let e of[-.4,.4])K(a,v,[.14,.6,.3],[e,.5,.3]);K(a,v,[.9,.14,.14],[0,.82,.36]),K(a,g.tunic,[1.06,.98,.9],[0,.5,-.06]),K(a,g.trim,[1.1,.1,.1],[0,.98,.38]);for(let e of[-.52,.52])K(a,g.trim,[.08,.96,.1],[e,.5,.38]);let e=K(a,g.tunic,[.6,.4,.6],[0,1.02,-.28]);e.rotation.x=.5}else{K(a,v,[.98,.26,.9],[0,.9,-.02]),K(a,v,[.98,.64,.22],[0,.62,-.36]),K(a,v,[.9,.14,.12],[0,.8,.38]);let e=m?Math.floor(f/4)%3:Math.floor(f/4)%2;if(m){for(let e of[-.48,.48])K(a,v,[.12,.62,.66],[e,.52,0]);e===1?(u_(a,v,.27,[0,1.06,-.32]),K(a,p===`herbalist`?5941306:y_,[.34,.08,.3],[0,.95,-.3])):e===2&&(K(a,v,[.3,.3,.3],[0,.92,-.5]),K(a,v,[.26,.7,.26],[0,.52,-.6]),K(a,g.trim===g_?y_:g.trim,[.32,.07,.32],[0,.82,-.52]))}else if(e===1){let e=K(a,v,[.9,.22,.3],[.05,1,.18]);e.rotation.x=-.35,e.rotation.z=.12}else for(let e of[-.47,.47])K(a,v,[.08,.3,.6],[e,.68,-.08])}if(l.add(u,d),u.position.set(0,-.53,.06),d.position.copy(u.position),T_(u,n.weapon===`axe`||n.weapon===`hammer`?n.weapon:`sword`),e===`archer`||p===`archer`?D_(d,{4160046:10119738,8007218:6957610,4865930:15260864}[g.tunic]??9726014):E_(d,p===`herbalist`?`life`:n.element,f%2),n.offhand===`shield`){let e=new H;e.position.set(-.17,-.36,.06),e.rotation.y=-Math.PI/2,c.add(e);let t=[[-.3,.34],[.3,.34],[.3,.02],[0,-.38],[-.3,.02]];C_(e,y_,t,.06);let n=C_(e,3099246,t.map(([e,t])=>[e*.82,t*.82+.01]),.07);n.position.z=.01,K(e,y_,[.14,.14,.06],[0,.06,.05])}else n.offhand===`orb`&&u_(c,7529709,.13,[0,-.6,.12]);return d.visible=!1,s_(r),{root:r,body:i,head:a,leftLeg:o,rightLeg:s,leftArm:c,rightArm:l,sword:u,wand:d,kind:e,phase:0}}function k_(){let e=new H,t=new H,n=new H,r=new H,i=new H,a=new H,o=new H;e.add(t),t.position.y=.6,u_(t,7830384,.6,[0,.22,0],[.75,.85,1.3]),t.add(n),n.position.set(0,.45,.64),u_(n,9409925,.36,[0,0,0],[1,.95,1.1]),K(n,12040866,[.36,.24,.44],[0,-.06,.32]),K(n,2635571,[.21,.12,.12],[0,-.03,.56]);for(let e of[-.22,.22]){let t=new W(new Kl(.15,.36,3),l_(6714216));t.position.set(e,.36,-.08),n.add(t),u_(n,16764016,.055,[e,.07,.29])}for(let[t,n,s]of[[r,-.29,-.42],[i,.29,-.42],[a,-.29,.4],[o,.29,.4]])e.add(t),t.position.set(n,.64,s),K(t,5924187,[.19,.54,.2],[0,-.24,0]);let s=K(t,6911339,[.19,.19,.74],[0,.17,-.9]);return s.rotation.x=-.4,s_(e),{root:e,body:t,head:n,leftLeg:r,rightLeg:i,leftArm:a,rightArm:o,sword:new H,wand:new H,kind:`wolf`,phase:0}}function A_(e,t,n,r,i){e.phase+=t*(n?11:2);let a=e.phase,o=n?.65:0;if(e.leftLeg.rotation.x=Math.sin(a)*o,e.rightLeg.rotation.x=-Math.sin(a)*o,e.body.position.y=(e.kind===`wolf`?.6:f_)+(n?Math.abs(Math.sin(a))*.06:Math.sin(a)*.018),e.kind===`wolf`)e.leftArm.rotation.x=-Math.sin(a)*o,e.rightArm.rotation.x=Math.sin(a)*o,e.body.rotation.x=r>0?-.2:0;else if(e.leftArm.rotation.x=-Math.sin(a)*o*.5,e.rightArm.rotation.x=Math.sin(a)*o*.35,e.body.rotation.y=0,e.rightArm.rotation.y=0,e.rightArm.rotation.z=-.12,r>0){let t=.28,n=r<t?-r/t:-1+2.4*Math.sin(Math.min(1,(r-t)/.72)*Math.PI/2);e.body.rotation.y=n*(i?.65:.28),e.rightArm.rotation.y=n*(i?1.8:1.35),e.rightArm.rotation.x=-.9,e.rightArm.rotation.z=-.22}}function j_(e,t,n,r=.4){let i=new wu;i.moveTo(0,0);for(let n=0;n<=28;n++){let r=-t+2*t*n/28;i.lineTo(Math.sin(r)*e,-Math.cos(r)*e)}i.lineTo(0,0);let a=new W(new hd(i),new Gc({color:n,transparent:!0,opacity:r,depthWrite:!1,side:2}));return a.rotation.x=-Math.PI/2,a}function M_(e){let t=[];for(let n of e.camps)n.parentId&&n.route.length>1&&t.push({id:`tree:${n.id}`,a:n.parentId,b:n.id,route:n.route});for(let n of e.connections??[])n.route.length>1&&t.push({id:n.id,a:n.from,b:n.to,route:n.route});return t}function N_(e,t){return M_(e).filter(e=>e.a===t||e.b===t).length}function P_(e,t){return N_(e,t)<4}function F_(e){return e<=0?0:Math.max(1,Math.ceil(e/1e3*100))}function I_(e,t){let n={d:1/0,along:0,at:t[0]},r=0;for(let i=1;i<t.length;i++){let a=t[i-1],o=t[i],s=u(a,o),c=b(e,a,o);if(c<n.d){let t=s?Math.max(0,Math.min(1,((e.x-a.x)*(o.x-a.x)+(e.z-a.z)*(o.z-a.z))/(s*s))):0;n={d:c,along:r+t*s,at:{x:a.x+(o.x-a.x)*t,z:a.z+(o.z-a.z)*t}}}r+=s}return{...n,length:r}}function L_(e,t,n){let r=null;for(let i of M_(e)){let e=I_(t,i.route);e.d<=n&&(!r||e.d<r.d)&&(r={link:i,d:e.d,at:e.at,along:e.along})}return r}function R_(e,t,n,r,i,a){let o=I_(n,t.route),s=e.camps.find(e=>e.id===r&&(r===t.a||r===t.b));if(!s)return null;let c=(r===t.b?o.length-o.along:o.along)/i;return{dest:s,meters:c,cost:F_(c),onRope:o.d<=a,arrived:u(n,s)<=a}}function z_(e,t){let n=I_(t,e.route);return n.along<n.length/2?e.b:e.a}function B_(e,t){let n=Math.max(0,t);for(let t=1;t<e.length;t++){let r=e[t-1],i=e[t],a=u(r,i);if(n<=a&&a>0)return{x:r.x+(i.x-r.x)*n/a,z:r.z+(i.z-r.z)*n/a};n-=a}return{...e[e.length-1]}}var V_={sword:`<path fill="#a8b5ba" d="m40 5 7 2-2 8-23 25-8-8Z"/><path stroke="#4c5b60" stroke-width="5" d="m10 29 17 15M17 36 8 47"/>`,staff:`<path stroke="#8b5c31" stroke-width="7" stroke-linecap="round" d="m14 47 20-34 8-4"/><path fill="#70c9e3" d="m33 5 10 1 5 10-11 4-8-7Z"/>`,armor:`<path fill="#668b94" stroke="#3e5860" stroke-width="2" d="m15 10 9 5h8l9-5 9 14-8 7-3-5v23H17V26l-3 5-8-7Z"/><path stroke="#d4b575" stroke-width="3" d="M17 36h22"/>`,helmet:`<path fill="#99a8ab" stroke="#53696f" stroke-width="2" d="M11 38V27a17 17 0 0 1 34 0v11l-10 8V29H21v17Z"/><path stroke="#d0aa63" stroke-width="4" d="M9 28h38"/>`,axe:`<path stroke="#8b5c31" stroke-width="5" stroke-linecap="round" d="M14 48 38 12"/><path fill="#b9c3c6" stroke="#4c5b60" stroke-width="2" d="M33 8c9 0 15 6 15 15l-9 1-8-8Z"/>`,hammer:`<path stroke="#8b5c31" stroke-width="5" stroke-linecap="round" d="M16 48 34 18"/><path fill="#9aa5a8" stroke="#4c5b60" stroke-width="2" d="m24 10 16-6 8 14-16 6Z"/>`,shield:`<path fill="#9a6a3c" stroke="#5d452f" stroke-width="2" d="M28 6c8 4 14 5 20 5 0 19-6 31-20 39C14 42 8 30 8 11c6 0 12-1 20-5Z"/><path stroke="#c9ccc6" stroke-width="4" d="M28 9v38M12 22h32"/><circle cx="28" cy="22" r="5" fill="#d4b575"/>`,hide:`<path fill="#9a6b45" stroke="#5c3d26" stroke-width="2" d="M14 12 22 8l6 4 6-4 8 4-2 9 5 8-5 6 2 9-8 3-6-4-6 4-8-3 2-9-5-6 5-8Z"/><path stroke="#c99a6c" stroke-width="2" d="M22 20q6 4 12 0M21 32q7 4 14 0"/>`,fang:`<path fill="#f1e8d2" stroke="#7d6b55" stroke-width="2" d="M20 8q14 2 16 14-2 14-10 28-2-14-9-24Q14 14 20 8Z"/><path stroke="#c9b894" stroke-width="2" d="M24 16q6 3 7 10"/>`,orb:`<circle cx="28" cy="25" r="15" fill="#70c9e3" stroke="#2f6f85" stroke-width="2"/><circle cx="23" cy="20" r="4" fill="#e9fbff"/><path fill="#8b5c31" stroke="#5d452f" stroke-width="2" d="M17 40h22l-4 9H21Z"/>`,boots:`<path fill="#8e643f" stroke="#5d452f" stroke-width="2" d="m15 8 17 2-3 22 14 9v8H10V34Z"/><path stroke="#d4b575" stroke-width="3" d="M14 18h17"/>`},H_={wood:`<path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 12h20v10H4z"/><ellipse cx="24" cy="17" rx="4" ry="5" fill="#d9a86a" stroke="#4a3220" stroke-width="2"/>`,ore:`<path fill="#8f9aa0" stroke="#3e474c" stroke-width="2" d="m6 22 4-11 9-4 8 8-3 10H9Z"/><path fill="#d27a4a" d="m13 13 4-2 2 4-4 2Z"/>`,fiber:`<path fill="none" stroke="#c9d36a" stroke-width="2.5" stroke-linecap="round" d="M16 28V8M16 20c-4-3-7-8-8-12M16 18c4-3 7-7 8-11"/>`,herbs:`<path fill="#6fcf7a" stroke="#2f6b3a" stroke-width="1.5" d="M16 28c0-10 2-15 9-19-1 8-4 13-9 14M16 28C14 19 11 15 6 13c1 7 4 11 10 12"/><circle cx="16" cy="9" r="3" fill="#e98fc6"/>`,rope:`<circle cx="16" cy="17" r="9" fill="none" stroke="#e8c27a" stroke-width="3"/><circle cx="16" cy="17" r="4" fill="none" stroke="#b0793c" stroke-width="2.5"/>`};function U_(e){return`<svg viewBox="0 0 32 32" aria-hidden="true">${H_[e]??``}</svg>`}function W_(e){return`<svg viewBox="0 0 56 56" aria-hidden="true">${V_[e.icon]??V_.sword}</svg>`}function G_(e){return e.slot===`material`?`materiał`:`${e.slot===`weapon`?`Atak`:`Obrona`} ${e.power}`}var K_={tix:`<circle cx="16" cy="16" r="11" fill="#e7b13c" stroke="#8a5a12" stroke-width="2"/><circle cx="16" cy="16" r="6.5" fill="none" stroke="#fff3b8" stroke-width="1.6" opacity=".7"/>`,potion:`<path fill="#c0445a" stroke="#5a1c28" stroke-width="2" d="M12 5h8v6l6 8a8 8 0 0 1-6.5 9h-7A8 8 0 0 1 6 19l6-8Z"/><path fill="#ffd2da" opacity=".7" d="M10 18h5v4h-5z"/><path stroke="#b0793c" stroke-width="3" d="M11 5h10"/>`,sword:`<path fill="#c9d3d6" d="m24 4 4 1-1 5-12 13-5-5Z"/><path stroke="#8b5c31" stroke-width="3" stroke-linecap="round" d="m7 18 7 7M10 22l-5 5"/>`,shield:`<path fill="#8fa4ab" stroke="#3e5860" stroke-width="2" d="M16 4c4 2 7 3 11 3 0 11-4 17-11 21C9 24 5 18 5 7c4 0 7-1 11-3Z"/>`,heart:`<path fill="#e05a5a" stroke="#6b1f1f" stroke-width="2" d="M16 27S4 19 4 11a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16Z"/>`,bag:`<path fill="#a8703c" stroke="#4a3220" stroke-width="2" d="M7 12h18l2 15H5Z"/><path fill="none" stroke="#4a3220" stroke-width="2.5" d="M11 12V9a5 5 0 0 1 10 0v3"/><path fill="#e8c27a" d="M13 17h6v4h-6z"/>`,sort:`<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M9 6v20M5 10l4-4 4 4M23 26V6M19 22l4 4 4-4"/>`,shop:`<path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13 7 5h18l3 8Z"/><path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M6 13h20v14H6z"/><path fill="#e7b13c" d="M13 18h6v9h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M10 5 9 13M16 5v8M22 5l1 8"/>`},q_=e=>`<svg viewBox="0 0 32 32" aria-hidden="true">${K_[e]??``}</svg>`,J_={sellShare:.5,potionPrice:40,woodPrice:5,ropePerTix:2},Y_=[`tix`,`wood`,`rope`,`potions`];function X_(e){return Math.max(1,Math.floor(e.value*yr(e)*J_.sellShare))}function Z_(e,t){switch(t){case`wood`:return Math.floor(e/J_.woodPrice);case`rope`:return Math.floor(e*J_.ropePerTix);case`potions`:return Math.floor(e/J_.potionPrice);default:return e}}function Q_(e,t,n,r,i){let a=n.findIndex(e=>e.id===r);if(a<0)return 0;let o=Z_(X_(n[a]),i);return o<=0?0:(n.splice(a,1),i===`tix`?t.coins+=o:i===`wood`?e.stock.wood+=o:i===`rope`?e.stock.rope+=o:t.potions=Er(t)+o,o)}function $_(e){let t=0;return e.bag=e.bag.filter(e=>e.slot!==`material`||(t+=X_(e),!1)),e.coins+=t,t}function ev(e){return e.coins<J_.potionPrice?!1:(e.coins-=J_.potionPrice,e.potions=Er(e)+1,!0)}var tv={common:`Zwykły`,uncommon:`Rzadki`,rare:`Rzadki`,epic:`Epicki`,legendary:`Legendarny`},nv={weapon:`Broń`,offhand:`Druga ręka`,armor:`Zbroja`,helmet:`Hełm`,boots:`Buty`,material:`Materiał`},rv={weapon:`sword`,offhand:`shield`,armor:`armor`,helmet:`helmet`,boots:`boots`},iv={tix:e=>`${e} tix`,wood:e=>`${e} drewna`,rope:e=>`${e} m liny`,potions:e=>e===1?`1 mikstura`:e>1&&e<5?`${e} mikstury`:`${e} mikstur`},av={tix:q_(`tix`),wood:U_(`wood`),rope:U_(`rope`),potions:q_(`potion`)};function ov(e,t=``,n=``){let r=document.createElement(e);return t&&(r.textContent=t),n&&(r.className=n),r}function sv(e,t,n=`inv-btn`){let r=ov(`button`,``,n);return r.type=`button`,r.innerHTML=e,r.onclick=t,r}var cv=e=>ae[e.rarity===`uncommon`?`rare`:e.rarity??`common`]??ae.common,lv=`<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 13h24v14H4z"/><path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13c0-6 4-8 12-8s12 2 12 8z"/><path fill="#e8c27a" d="M13 15h6v6h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M4 18h24"/></svg>`,uv=420,dv={id:``,at:0};function fv(e,t,n,r){let i=ov(`button`,``,`inv-cell`);if(i.type=`button`,!t)return i.disabled=!0,i.setAttribute(`aria-label`,`Puste pole`),i;let a=n===`worn`?null:Qr(e.hero,t),o=t.slot===`material`?yr(t)>1?`<span class="inv-count">×${yr(t)}</span>`:``:`<span class="inv-power">${t.power}</span>`,s=a&&a.delta>0?`<span class="inv-up" title="Lepsze niż założone">▲</span>`:``;i.innerHTML=W_(t)+o+s,i.style.setProperty(`--rarity`,cv(t)),i.classList.add(`r-${t.rarity??`common`}`),i.setAttribute(`aria-label`,`${t.name}${yr(t)>1?` ×${yr(t)}`:``}, ${G_(t)}`),i.title=`${t.name} · ${G_(t)}`;let c=e.pick?.id===t.id;return i.classList.toggle(`selected`,c),i.setAttribute(`aria-pressed`,String(c)),i.onclick=()=>{let i=performance.now(),a=dv.id===t.id&&i-dv.at<uv;dv={id:t.id,at:i},a&&r?(dv={id:``,at:0},r()):(e.setPick({id:t.id,from:n}),e.rerender())},i}function pv(e,t,n,r=``,i=!1){let a=ov(`span`,``,`inv-chip ${r}`);return a.innerHTML=`${e}${i?`<span>${n}</span>`:``}<b>${t}</b>`,a.title=n,a.setAttribute(`aria-label`,`${n}: ${t}`),a}function mv(e,t,n){let{state:r,hero:i}=n;!n.atCamp&&n.tab!==`inventory`&&(n.tab=`inventory`),t.replaceChildren();let a=ov(`div`,``,`inv-tabs`);a.setAttribute(`role`,`tablist`);for(let[e,t,r]of[[`inventory`,`Plecak`,`bag`],[`vault`,`Skarbiec`,`vault`],[`shop`,`Sklep`,`shop`]]){if(e!==`inventory`&&!n.atCamp)continue;let i=sv(`${r===`vault`?lv:q_(r)}<span>${t}</span>`,()=>n.setTab(e),`inv-tab`);i.setAttribute(`role`,`tab`),i.setAttribute(`aria-selected`,String(n.tab===e)),i.setAttribute(`aria-label`,t),a.append(i)}t.append(a);let o=ov(`div`,``,`inv inv-${n.tab}`),s=i.bag,c=r.vault,l=n.pick,u=l?.from===`bag`?s.find(e=>e.id===l.id):l?.from===`vault`?c.find(e=>e.id===l.id):l?.from===`worn`?Object.values(i.equipment).find(e=>e?.id===l.id):void 0;l&&!u&&n.setPick(null);let d=e=>{$r(s,c,e.id),n.setPick(null),n.changed()},f=e=>{$r(c,s,e.id,or.slots)?n.setPick(null):n.notify(`Plecak jest pełny`),n.changed()},p=e=>{e.slot!==`material`&&(Xr(i,e.id),n.setPick({id:e.id,from:`worn`}),n.changed(!0))},m=e=>{e.slot!==`material`&&(Zr(i,e.slot)?n.setPick({id:e.id,from:`bag`}):n.notify(`Plecak jest pełny`),n.changed(!0))},h=e=>n.tab===`vault`?()=>d(e):n.tab===`inventory`&&e.slot!==`material`?()=>p(e):void 0,g=ov(`section`,``,`inv-side`);if(n.tab===`inventory`){let e=ov(`div`,``,`inv-doll`);for(let t of[`helmet`,`weapon`,`armor`,`offhand`,`boots`]){let r=i.equipment[t],a=r?fv(n,r,`worn`,()=>m(r)):ov(`button`,``,`inv-cell inv-empty`);a.classList.add(`slot-${t}`),r||(a.type=`button`,a.disabled=!0,a.innerHTML=`<svg viewBox="0 0 56 56" aria-hidden="true">${V_[rv[t]]}</svg><small>${nv[t]}</small>`,a.setAttribute(`aria-label`,`${nv[t]}: puste`)),e.append(a)}let t=ov(`div`,``,`inv-stats`);t.append(pv(q_(`sword`),String(Pr(i)),`Atak`,`stat`,!0),pv(q_(`shield`),String(Fr(i)),`Obrona`,`stat`,!0),pv(q_(`heart`),`${Math.round(i.hp)}/${Nr(i)}`,`Zdrowie`,`stat`,!0),pv(q_(`tix`),String(i.coins),`Tix`,`stat`,!0),pv(q_(`potion`),String(Er(i)),`Mikstury`,`stat`,!0)),g.append(ov(`h3`,i.name,`inv-head`),e,t)}else if(n.tab===`vault`){let e=ov(`div`,``,`inv-head-row`);e.append(ov(`h3`,`Skarbiec`,`inv-head`),ov(`span`,`${c.length}`,`inv-sub`));let t=ov(`div`,``,`inv-money`);t.append(pv(q_(`tix`),String(r.bank),`Tix w skarbcu`));let a=sv(`Wpłać${i.coins?` ${i.coins}`:``}`,()=>{r.bank+=i.coins,i.coins=0,n.changed()},`inv-btn small`);a.disabled=!i.coins,a.setAttribute(`aria-label`,`Wpłać`);let o=sv(`Wypłać${r.bank?` ${r.bank}`:``}`,()=>{i.coins+=r.bank,r.bank=0,n.changed()},`inv-btn small`);o.disabled=!r.bank,o.setAttribute(`aria-label`,`Wypłać`),t.append(a,o);let s=ov(`div`,``,`inv-goods`);for(let e of sr)s.append(pv(U_(e),`${r.stock[e]}${e===`rope`?` m`:``}`,cr[e]));let l=ov(`div`,``,`inv-acts`),u=Object.entries(r.pending??{}).filter(([,e])=>(e??0)>=1);if(r.rates&&Object.values(r.rates).some(e=>(e??0)>0)){let e=sv(`Zbierz z kręgów${u.length?` <small>${u.map(([e,t])=>`+${Math.floor(t??0)}${e===`rope`?` m`:``} ${cr[e].toLowerCase()}`).join(`, `)}</small>`:``}`,()=>{pr(r),n.changed()},`inv-btn`);e.disabled=!u.length,e.setAttribute(`aria-label`,`Zbierz z kręgów`),l.append(e)}let d=sv(`Skręć linę <small>10 włókna → ${10*or.ropePerFiber} m</small>`,()=>{mr(r,10),n.changed()});d.setAttribute(`aria-label`,`Skręć linę`),d.disabled=r.stock.fiber<10,l.append(d);let p=ov(`div`,``,`inv-grid inv-grid-vault`),m=Math.max(16,Math.ceil((c.length+1)/4)*4);for(let e=0;e<m;e++)p.append(fv(n,c[e],`vault`,c[e]?()=>f(c[e]):void 0));g.append(e,t,s,l,p)}else{let e=ov(`div`,``,`inv-head-row`);e.append(ov(`h3`,`Kupiec`,`inv-head`));let t=ov(`div`,``,`inv-goods`);t.append(pv(q_(`tix`),String(i.coins),`Tix`),pv(q_(`potion`),String(Er(i)),`Mikstury`),pv(U_(`wood`),String(r.stock.wood),`Drewno`),pv(U_(`rope`),`${r.stock.rope} m`,`Lina`));let a=sv(`${q_(`potion`)}<span>Kup miksturę</span><small>${J_.potionPrice} tix</small>`,()=>{ev(i)&&n.changed()},`inv-btn inv-buy`);a.setAttribute(`aria-label`,`Kup miksturę`),a.disabled=i.coins<J_.potionPrice;let o=s.filter(e=>e.slot===`material`),c=sv(`<span>Sprzedaj materiały</span><small>${o.reduce((e,t)=>e+X_(t),0)} tix</small>`,()=>{let e=$_(i);e&&n.notify(`Sprzedano materiały za ${e} tix`),n.setPick(null),n.changed()},`inv-btn inv-buy`);c.setAttribute(`aria-label`,`Sprzedaj materiały`),c.disabled=!o.length,g.append(e,t,a,c)}let _=ov(`section`,``,`inv-bag`),v=ov(`div`,``,`inv-head-row`);v.append(ov(`h3`,`Plecak`,`inv-head`),ov(`span`,`${s.length}/${or.slots}`,`inv-sub`));let y=ov(`div`,``,`inv-tools`);if(n.tab===`vault`){let e=sv(`Materiały do skarbca`,()=>{for(let e of s.filter(e=>e.slot===`material`))$r(s,c,e.id);n.setPick(null),n.changed()},`inv-btn small`);e.disabled=!s.some(e=>e.slot===`material`),y.append(e)}let b=sv(q_(`sort`),()=>{Tr(s),n.changed()},`inv-btn small icon`);b.title=`Sortuj`,b.setAttribute(`aria-label`,`Sortuj plecak`),y.append(b),v.append(y);let x=ov(`div`,``,`inv-grid inv-grid-bag`);for(let e=0;e<or.slots;e++){let t=s[e];x.append(fv(n,t,`bag`,t?h(t):void 0))}_.append(v,x);let S=ov(`aside`,``,`inv-info`);if(S.setAttribute(`aria-live`,`polite`),u){let e=u,t=ov(`div`,``,`inv-info-top`),a=ov(`div`,``,`inv-pic r-${e.rarity??`common`}`);a.innerHTML=W_(e),a.style.setProperty(`--rarity`,cv(e));let o=ov(`div`,``,`inv-name`),h=ov(`h3`,e.name);if(h.style.color=cv(e),o.append(h,ov(`small`,[e.slot===`material`?``:tv[e.rarity??`common`],nv[e.slot],e.level&&e.level>1?`poz. ${e.level}`:``].filter(Boolean).join(` · `))),t.append(a,o),S.append(t),e.slot===`material`)S.append(ov(`p`,`Ilość: ${yr(e)}`,`inv-stat`));else{let t=ov(`p`,``,`inv-stat`);t.innerHTML=`<b>${e.slot===`weapon`?`Atak`:`Obrona`} ${e.power}</b>`;let n=l?.from===`worn`?null:Qr(i,e);if(n){let e=ov(`span`,n.delta>0?`▲ ${n.delta}`:n.delta<0?`▼ ${-n.delta}`:`=`,`inv-delta ${n.delta>0?`up`:n.delta<0?`down`:``}`);e.title=n.worn?`względem: ${n.worn.name} (${n.worn.power})`:`nic nie założone`,t.append(e),S.append(t,ov(`small`,n.worn?`zamiast: ${n.worn.name}`:`pole jest puste`,`inv-vs`))}else S.append(t),l?.from===`worn`&&S.append(ov(`small`,`założone`,`inv-vs`))}let g=ov(`div`,``,`inv-info-acts`);if(n.tab===`shop`){if(l?.from===`worn`)g.append(ov(`small`,`Zdejmij przedmiot, aby go sprzedać`,`inv-vs`));else{let t=X_(e),a=l?.from===`vault`?c:s;g.append(ov(`small`,`Sprzedaj${yr(e)>1?` (×${yr(e)})`:``} za:`,`inv-label`));for(let o of Y_){let s=Z_(t,o),c=sv(`${av[o]}<span>${iv[o](s)}</span>`,()=>{let t=Q_(r,i,a,e.id,o);t&&n.notify(`Sprzedano: ${e.name} → ${iv[o](t)}`),n.setPick(null),n.changed()},`inv-btn inv-pay${o===`tix`?` primary`:``}`);c.setAttribute(`aria-label`,`Sprzedaj za ${iv[o](s)}`),c.disabled=s<=0,g.append(c)}}}else if(l?.from===`worn`)g.append(sv(`Zdejmij`,()=>m(e),`inv-btn primary`));else if(l?.from===`vault`)g.append(sv(`Do plecaka`,()=>f(e),`inv-btn primary`));else{let t=e.slot===`material`?null:sv(`Załóż`,()=>p(e),`inv-btn`),r=n.atCamp?sv(`Do skarbca`,()=>d(e),`inv-btn`):null,i=n.tab===`vault`?[r,t]:[t,r];i.forEach((e,t)=>{e&&(t!==0&&i[0]||e.classList.add(`primary`),g.append(e))})}S.append(g)}else{let e=ov(`div`,``,`inv-placeholder`);e.innerHTML=`${q_(`bag`)}<span>Wybierz przedmiot</span><small>${n.tab===`shop`?`z plecaka, aby go sprzedać`:`dwa dotknięcia: `+(n.tab===`vault`?`przenieś`:`załóż / zdejmij`)}</small>`,S.append(e)}o.append(g,_,S),e.replaceChildren(o)}var hv=e=>document.getElementById(e);function gv(e,t=``,n=``){let r=document.createElement(e);return r.textContent=t,r.className=n,r}function _v(e,t,n=``){let r=gv(`button`,e,n);return r.type=`button`,r.onclick=t,r}var vv={shop:`<path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13 7 5h18l3 8Z"/><path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M6 13h20v14H6z"/><path fill="#e7b13c" d="M13 18h6v9h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M10 5 9 13M16 5v8M22 5l1 8"/>`,rope:`<path fill="none" stroke="#e8c27a" stroke-width="3" stroke-linecap="round" d="M5 25c4-9 8-9 11-3s7 6 11-5"/><path fill="#8b5c31" d="M3 23h5v7H3zM24 13h5v7h-5z"/><circle cx="26.5" cy="10" r="2.5" fill="#ffd27a"/>`,vault:`<path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 13h24v14H4z"/><path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13c0-6 4-8 12-8s12 2 12 8z"/><path fill="#e8c27a" d="M13 15h6v6h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M4 18h24"/>`,recruit:`<circle cx="12" cy="10" r="5" fill="#e8c27a"/><path fill="#b0793c" d="M3 28c0-7 4-11 9-11s9 4 9 11z"/><path stroke="#8ff0bf" stroke-width="3" stroke-linecap="round" d="M25 9v10M20 14h10"/>`};function yv(e,t,n=``){let r=le(e.role,e.trait),i=`id`in e&&typeof e.id==`string`?ir({id:e.id,role:e.role,spell:e.spell}):null;return[gv(`strong`,ge(e)),gv(`span`,` · ${Or(e.role)}${i?` (${$n[i].name})`:``} · poz. ${t} · ${ie[e.rarity??`common`]}${n?` — ${n}`:``}`),...r?[gv(`small`,`${r.name}: ${r.text}`,`trait-line`)]:[]]}function bv(e,t,n,r){return e.append(...yv(t,n,r)),e.style.setProperty(`--rarity`,ae[t.rarity??`common`]),e}function xv(e){return Math.max(0,Math.min(100,100-(e.readyAt-Date.now())/or.recruitmentMs*100))}function Sv(e,t,n,r,i,a){let o=new W(t,l_(n));return o.position.set(r,i,a),e.add(o),o}function Cv(e){let t=new H;t.position.set(e.x,0,e.z),t.userData.campId=e.id;let n=Sv(t,new Gl(0,1.8,2.2,4,1,!1,Math.PI/4),12426085,-1.6,1.1,-1.2);n.scale.z=.8,Sv(t,new pd(.7,1.25),5001538,-1.6,.65,.12),Sv(t,new Gl(.13,.18,1.7,7),8544829,1.2,.85,.5),Sv(t,new Ul(1.5,1.1,.14),8873020,1.2,1.8,.5),Sv(t,new pd(.62,.72),15325360,1,1.8,.58),Sv(t,new pd(.4,.5),14467983,1.62,1.9,.59),Sv(t,new Gl(.12,.16,.85,7),7688757,0,.43,1.7),Sv(t,new _d(.18,.05,6,10),12951900,0,.75,1.7);let r=new W(new md(2.7,2.85,40),new Gc({color:15121250,transparent:!0,opacity:.65,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=.08,r.visible=!1,t.add(r),t.userData.highlight=r,t}function wv(e,t,n){let r=[];for(let i=1;i<e.length;i++){let a=e[i-1],o=e[i],s=u(a,o),c=Math.max(2,Math.ceil(s*2));for(let e=0;e<=c;e++){let i=e/c;r.push(new V(a.x+(o.x-a.x)*i,Math.max(.12,.8-Math.sin(Math.PI*i)*Math.min(.65,s*.055))+(n?Math.sin(t*3+i*7)*.025:0),a.z+(o.z-a.z)*i))}}return r}function Tv(){let e=new wu;e.moveTo(0,1.1),e.lineTo(.85,0),e.lineTo(.32,0),e.lineTo(.32,-.9),e.lineTo(-.32,-.9),e.lineTo(-.32,0),e.lineTo(-.85,0),e.closePath();let t=new H,n=new W(new hd(e),new Gc({color:1775408,depthTest:!1,transparent:!0})),r=new W(new hd(e),new Gc({color:16765503,depthTest:!1,transparent:!0}));n.scale.setScalar(1.25),n.position.y=-.14,r.position.z=.01,n.renderOrder=r.renderOrder=20;let i=new H;return i.rotation.x=-Math.PI/2,i.add(n,r),t.add(i),t.scale.setScalar(1.1),t.visible=!1,t}var Ev=class{h;group=new H;campViews=new Map;waiting=new Map;territory=new H;liveLine=new Dl(new Nc,new yl({color:7951415}));connections=new jl(new Nc,new yl({color:8940873}));marker=new W(new md(3.5,3.6,32),new Gc({color:13874027,transparent:!0,opacity:.8,depthTest:!1}));spots=new H;spotList=[];get spotCount(){return this.spotList.length}get spotPoints(){return this.spotList.map(e=>({...e}))}spotPulse=0;rope=null;selected;menuCamp;dialog;body;title;previousFocus=null;pick2=null;view=``;offerItems=new Set;offerGold=0;clock=0;noticeClock=0;pick=null;arrow=Tv();rising=new Map;constructor(e){this.h=e,e.scene.add(this.group,this.liveLine,this.connections,this.marker,this.territory,this.spots,this.arrow);for(let e=0;e<3;e++){let e=new H,t=new W(new Wl(3.6,40),new Gc({color:7328672,transparent:!0,opacity:.18,depthWrite:!1})),n=new W(new md(3.3,3.6,40),new Gc({color:9433279,transparent:!0,opacity:.85,depthTest:!1}));t.rotation.x=n.rotation.x=-Math.PI/2,e.add(t,n),e.visible=!1,this.spots.add(e)}this.marker.rotation.x=-Math.PI/2,this.marker.visible=!1,document.body.insertAdjacentHTML(`beforeend`,`<button id="action" class="context-action" aria-label="Akcja"><span>⚑</span><small id="action-label">Akcja</small></button><nav id="camp-menu" hidden aria-label="Obóz"></nav><dialog id="expedition-panel"><div class="panel-heading"><h2 id="panel-title"></h2><button id="panel-close" aria-label="Zamknij">×</button></div><div id="panel-body"></div></dialog><nav id="expedition-tools" aria-label="Wyprawa"><button id="inventory" aria-label="Plecak" title="Plecak (I)">${q_(`bag`)}</button></nav><button id="world-state" hidden></button><div id="rope-travel" hidden><button id="rope-go" type="button"><span aria-hidden="true">➜</span><b id="rope-dist"></b><small id="rope-cost"></small></button><button id="rope-flip" type="button" aria-label="Odwróć kierunek" title="Odwróć kierunek">⇄</button></div><div id="travel-veil" hidden><div><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="17" r="9" fill="none" stroke="#e8c27a" stroke-width="3"/><circle cx="16" cy="17" r="4" fill="none" stroke="#b0793c" stroke-width="2.5"/></svg><b id="travel-veil-text">Podróż liną…</b></div></div>`),this.dialog=hv(`expedition-panel`),this.body=hv(`panel-body`),this.title=hv(`panel-title`),hv(`panel-close`).onclick=()=>this.close(),this.dialog.addEventListener(`cancel`,e=>{e.preventDefault(),this.close()}),this.dialog.addEventListener(`click`,e=>{if(e.target===this.dialog){let t=this.dialog.getBoundingClientRect(),n=e;(n.clientX<t.left||n.clientX>t.right||n.clientY<t.top||n.clientY>t.bottom)&&this.close()}}),hv(`action`).onclick=()=>this.action(),hv(`rope-go`).onclick=()=>void this.ride(),hv(`rope-flip`).onclick=()=>{this.pick&&(this.pick.to=this.pick.to===this.pick.link.a?this.pick.link.b:this.pick.link.a,this.showPick())},hv(`inventory`).onclick=()=>this.open(`inventory`);let t=document.createElement(`button`);t.id=`characters`,t.className=`portrait-switch`,t.setAttribute(`aria-label`,`Wędrowcy`),document.querySelector(`.vitals`)?.append(t),t.onclick=()=>this.open(`characters`),hv(`world-map`).onclick=()=>this.open(`world`),hv(`world-state`).onclick=()=>e.retry(),document.addEventListener(`pointerdown`,e=>{e.target.closest(`#camp-menu,#world`)||this.hideMenu(),e.target.closest(`#rope-travel,#world`)||this.clearPick()}),document.addEventListener(`keydown`,e=>{e.code!==`Escape`||this.dialog.open||!this.rope&&hv(`camp-menu`).hidden||(e.preventDefault(),this.rope=null,this.hideMenu()),e.code===`KeyE`&&!this.dialog.open&&!e.repeat&&(e.preventDefault(),this.action()),e.code===`KeyI`&&!this.dialog.open&&(e.preventDefault(),this.open(`inventory`))}),this.refreshWorld()}close(){this.dialog.close(),this.h.panel(!1),this.previousFocus?.focus(),this.view=``,this.pick2=null,this.h.save()}open(e){(this.h.canAct()||this.dialog.open)&&(this.hideMenu(),this.view=e,this.pick2=null,this.dialog.open||(this.previousFocus=document.activeElement,this.dialog.showModal(),this.h.panel(!0)),this.render())}render(){this.body.replaceChildren(),this.dialog.classList.remove(`inv-dialog`);let e=this.h.state,t=Gr(e);if(hv(`characters`).setAttribute(`aria-label`,`Wędrowcy · ${t.name}`),this.view===`characters`){this.title.textContent=`Drużyna`;let n=Ur(e);this.body.append(gv(`p`,`W drużynie ${n.length} / 3. Reszta czeka w obozach.`,`party-note`));for(let r of e.characters){let i=gv(`div`,``,`character-row`),a=n.includes(r.id),o=_v(``,()=>void this.control(r),`character-choice`);if(o.append(...yv(r,Ar(r.exp))),o.classList.toggle(`selected`,r.id===t.id),o.style.setProperty(`--portrait-color`,`hsl(${r.appearance%360} 25% 47%)`),o.style.setProperty(`--rarity`,ae[r.rarity??`common`]),i.append(o),r.id!==t.id&&_r(r.role))i.append(gv(`span`,`Pracuje w obozie`,`party-job`));else if(r.id!==t.id){let n=_v(a?`Zostaw w obozie`:`Do drużyny`,()=>{if(!a&&!Kr(e,t)&&u(r,t)>or.safeRadius)this.h.notify(`Wędrowiec czeka w obozie — idź po niego`);else{if(a){let t=Kr(e,r,1/0)??e.camps[0];Object.assign(r,{x:t.x+1.5,z:t.z+1.5,campId:t.id})}Wr(e,r.id)?(this.h.party(),this.h.save(),this.render()):this.h.notify(`Drużyna ma najwyżej 3 osoby`)}},`party-toggle`);i.append(n)}this.body.append(i)}return}if(this.view===`world`){this.title.textContent=`Świat`;let e=gv(`form`),t=gv(`input`),n=gv(`input`);t.type=n.type=`number`,t.step=n.step=`any`,t.required=n.required=!0,t.min=`-90`,t.max=`90`,n.min=`-180`,n.max=`180`,t.placeholder=`Szerokość`,n.placeholder=`Długość`,t.setAttribute(`aria-label`,`Szerokość geograficzna`),n.setAttribute(`aria-label`,`Długość geograficzna`);let r=_v(`Wyrusz`,()=>{});r.type=`submit`,e.append(t,n,r),e.onsubmit=e=>{e.preventDefault(),this.travel({lat:Number(t.value),lon:Number(n.value)})},this.body.append(e);for(let[e,t,n]of[[`Lublin`,51.2482,22.5681],[`Warszawa`,52.2297,21.0122],[`Stambuł`,41.0082,28.9784],[`Singapur`,1.3521,103.8198],[`Nowy Jork`,40.7128,-74.006]])this.body.append(_v(e,()=>void this.travel({lat:t,lon:n}),`place-choice`));return}if(this.view===`recruit`){this.recruit();return}let n=this.view===`vault`||this.view===`shop`?this.view:`inventory`;this.dialog.classList.add(`inv-dialog`),mv(this.body,this.title,{state:e,hero:t,tab:n,atCamp:!!Kr(e,t),pick:this.pick2,setPick:e=>this.pick2=e,setTab:e=>{this.view=e,this.pick2=null,this.render()},rerender:()=>this.render(),changed:e=>{e&&this.h.switch(t),this.h.save(),this.render()},notify:e=>this.h.notify(e)})}async travel(e){if(!Kr(this.h.state,Gr(this.h.state))||this.h.combat()||this.rope)this.h.notify(`Wróć do obozu`);else if(!(!Number.isFinite(e.lat)||Math.abs(e.lat)>90||!Number.isFinite(e.lon)||Math.abs(e.lon)>180)){this.body.replaceChildren(gv(`p`,`Wczytywanie mapy…`));try{await this.h.travel(e),this.close(),this.refreshWorld()}catch{this.body.replaceChildren(gv(`p`,`Mapa jest niedostępna`),_v(`Spróbuj ponownie`,()=>void this.travel(e)),_v(`Wróć`,()=>this.render()))}}}recruit(){let e=this.h.state,t=Gr(e),n=this.menuCamp??Kr(e,t);if(this.title.textContent=`Twoja oferta`,!n||u(n,t)>or.safeRadius){this.body.append(gv(`p`,`Wróć do obozu`));return}let r=ai(e,n.id);if(r){this.body.append(gv(`p`,`${r.gold} tix · ${r.items.length} przedm.`));let t=ti(r);if(r.candidates!==null||t.length){this.title.textContent=t.length?`Zgłoszenia`:`Brak zgłoszeń`;for(let i of t)this.body.append(bv(_v(``,()=>{let t=ii(e,r.id,i.id,n.id);t&&(Ur(e).length<3&&!_r(t.role)&&(Wr(e,t.id),this.h.party()),this.h.save(),this.refreshWorld(),this.render())},`candidate`),i,i.level,`Zatrudnij`))}if(r.candidates===null){this.body.append(gv(`p`,t.length?`Ogłoszenie wisi jeszcze:`:`Czekamy na chętnych… Ogłoszenie wisi jeszcze:`));let e=Math.max(0,Math.ceil((r.readyAt-Date.now())/1e3)),n=gv(`p`,`${Math.floor(e/60)}:${String(e%60).padStart(2,`0`)}`,`offer-timer`);n.id=`offer-timer`;let i=gv(`div`,``,`offer-progress`);i.innerHTML=`<i id="offer-bar" style="width:${xv(r)}%"></i>`,i.setAttribute(`role`,`progressbar`),this.body.append(n,i)}this.body.append(_v(r.candidates?.length===0?`Odbierz ofertę`:`Wycofaj ofertę`,()=>{oi(e,r.id),this.h.save(),this.render()}));return}let i=gv(`form`),a=gv(`input`);a.type=`range`,a.min=`0`,a.max=String(t.coins),a.step=`1`,this.offerGold=Math.min(this.offerGold,t.coins),a.value=String(this.offerGold),a.setAttribute(`aria-label`,`Tix w ofercie`);let o=gv(`output`,`${this.offerGold} tix`,`gold-readout`),s=e=>{this.offerGold=Math.max(0,Math.min(t.coins,Math.round(e))),a.value=String(this.offerGold),o.textContent=`${this.offerGold} tix`,m()};a.oninput=()=>s(Number(a.value));let c=gv(`div`,``,`gold-stepper`);for(let e of[-50,-10,10,50])c.append(_v(e>0?`+${e}`:`−${-e}`,()=>s(this.offerGold+e),`gold-step`));c.insertBefore(o,c.children[2]),i.append(c,a);let l=gv(`div`,``,`offer-grid`);for(let e of t.bag){let t=_v(``,()=>{this.offerItems.has(e.id)?this.offerItems.delete(e.id):this.offerItems.add(e.id),this.render()},`inv-cell`);t.innerHTML=W_(e)+(e.slot===`material`?(e.count??1)>1?`<span class="inv-count">×${e.count}</span>`:``:`<span class="inv-power">${e.power}</span>`),t.style.setProperty(`--rarity`,ae[e.rarity===`uncommon`?`rare`:e.rarity??`common`]),t.setAttribute(`aria-label`,`${e.name}, ${G_(e)}`),t.title=`${e.name} · ${G_(e)}`,t.setAttribute(`aria-pressed`,String(this.offerItems.has(e.id))),t.classList.toggle(`selected`,this.offerItems.has(e.id)),l.append(t)}i.append(l);let d=t.bag.filter(e=>this.offerItems.has(e.id));if(d.length){let e=gv(`ul`,``,`offer-items`);for(let t of d)e.append(gv(`li`,`${t.name} · ${G_(t)} · ${t.value} tix`));i.append(e)}let f=_v(`Wystaw`,()=>{});f.type=`submit`;let p=gv(`div`,``,`recruitment-profile`),m=()=>{let e=be({gold:this.offerGold,items:t.bag.filter(e=>this.offerItems.has(e.id)),ceiling:Ar(t.exp)},n.buildings);f.disabled=!Number.isSafeInteger(this.offerGold)||this.offerGold<0||this.offerGold>t.coins||!e.chance,p.replaceChildren(gv(`p`,`Szansa zgłoszenia: ${Math.round(e.chance*100)}%`),gv(`p`,`Wojownik ${Math.round(e.roles.warrior*100)}% · Mag ${Math.round(e.roles.mage*100)}% · Łucznik ${Math.round(e.roles.archer*100)}%`),gv(`p`,`Poziom: ${e.minLevel===e.maxLevel?e.maxLevel:`${e.minLevel}–${e.maxLevel}`}`))};m(),i.append(p),i.append(f),i.onsubmit=t=>{t.preventDefault(),ei(e,n.id,this.offerGold,[...this.offerItems])?(this.offerGold=0,this.offerItems.clear(),this.h.save(),this.render()):this.h.notify(`Dodaj tix lub przedmiot`)},this.body.append(i)}hideMenu(){hv(`camp-menu`).hidden=!0}menu(e){this.menuCamp=e;let t=hv(`camp-menu`),n=(e,t,n)=>{let r=_v(``,n,`camp-item`);return r.innerHTML=`<svg viewBox="0 0 32 32" aria-hidden="true">${t}</svg><span>${e}</span>`,r.setAttribute(`aria-label`,e),r};t.replaceChildren(n(`Rozciągnij linę`,vv.rope,()=>{P_(this.h.state,e.id)?this.ropeMax()<or.minCampDistance?(this.hideMenu(),this.h.notify(`Za mało liny (masz ${this.h.state.stock.rope} m, potrzeba ${Math.ceil(or.minCampDistance/En)} m). Skręć ją z włókna w Skarbcu.`)):(this.rope={campId:e.id,points:[{x:e.x,z:e.z},{...Gr(this.h.state)}]},this.hideMenu()):(this.h.notify(`Z obozu wychodzi już 4 liny`),this.hideMenu())}),n(`Skarbiec`,vv.vault,()=>this.open(`vault`)),n(`Sklep`,vv.shop,()=>this.open(`shop`)),n(`Rekrutuj`,vv.recruit,()=>{this.offerGold=0,this.offerItems.clear(),this.open(`recruit`)})),t.hidden=!1,this.positionMenu()}positionMenu(){if(!this.menuCamp)return;let e=new V(this.menuCamp.x,2.6,this.menuCamp.z).project(this.h.camera),t=hv(`camp-menu`);t.style.left=`${Math.max(10,Math.min(innerWidth-195,(e.x+1)*innerWidth/2+30))}px`,t.style.top=`${Math.max(10,Math.min(innerHeight-160,(1-e.y)*innerHeight/2-40))}px`}canRollBack(){if(!this.rope||this.connectionTarget())return!1;let e=this.h.state.camps.find(e=>e.id===this.rope.campId);return!!e&&u(e,Gr(this.h.state))<=or.safeRadius}rollBack(){this.rope=null,this.spotList=[],this.h.notify(`Lina zwinięta`)}action(){this.rope&&this.canRollBack()?this.rollBack():this.h.canAct()&&(this.rope?this.place():this.selected&&this.menu(this.selected))}click(e,t){if(!this.h.canAct())return!1;if(this.rope)return this.canRollBack()?this.rollBack():this.place(),!0;let n=new B(e/innerWidth*2-1,-t/innerHeight*2+1),r=new Pf;r.setFromCamera(n,this.h.camera);let i=r.intersectObjects([...this.campViews.values()],!0);if(i.length){let e=i[0].object;for(;e&&!e.userData.campId;)e=e.parent;let t=this.h.state.camps.find(t=>t.id===e?.userData.campId);if(t)return u(t,Gr(this.h.state))>or.safeRadius?this.h.notify(`Podejdź do obozu`):this.menu(t),!0}this.hideMenu();let a=Gr(this.h.state),o=new Lc(new V(0,1,0),-this.h.ground(a.x,a.z)),s=r.ray.intersectPlane(o,new V),c=s&&L_(this.h.state,{x:s.x,z:s.z},1.4);return c?(this.pick={link:c.link,to:z_(c.link,a),along:c.along},this.showPick(),!0):(this.clearPick(),!1)}plan(){return this.pick?R_(this.h.state,this.pick.link,Gr(this.h.state),this.pick.to,En,or.safeRadius):null}showPick(){let e=this.plan();if(!this.pick||!e)return this.clearPick();let t=Gr(this.h.state);hv(`rope-dist`).textContent=e.meters>=1e3?`${(e.meters/1e3).toFixed(1)} km`:`${Math.round(e.meters)} m`,hv(`rope-cost`).textContent=`${e.cost} tix`,hv(`rope-travel`).classList.toggle(`short`,t.coins<e.cost),hv(`rope-go`).setAttribute(`aria-label`,`Podróż liną ${hv(`rope-dist`).textContent}, ${e.cost} tix`),hv(`rope-travel`).hidden=!1;let n=this.pick.link.route,r=B_(n,this.pick.along),i=B_(n,this.pick.along+(this.pick.to===this.pick.link.b?1:-1));this.arrow.position.set(r.x,1+this.h.ground(r.x,r.z),r.z),this.arrow.rotation.set(0,Math.atan2(i.x-r.x,i.z-r.z)+Math.PI,0),this.arrow.visible=!0,this.positionPick()}positionPick(){if(!this.pick)return;let e=this.arrow.position.clone().project(this.h.camera),t=hv(`rope-travel`);t.style.left=`${Math.max(10,Math.min(innerWidth-190,(e.x+1)*innerWidth/2-80))}px`,t.style.top=`${Math.max(10,Math.min(innerHeight-70,(1-e.y)*innerHeight/2-78))}px`}clearPick(){this.pick=null,this.arrow.visible=!1,hv(`rope-travel`).hidden=!0}pickRope(e,t){let n=L_(this.h.state,e,1.4);return n?(this.pick={link:n.link,to:t??z_(n.link,Gr(this.h.state)),along:n.along},this.showPick(),!0):!1}async ride(){let e=this.plan(),t=this.h.state,n=Gr(t);if(e){if(this.rope)return this.h.notify(`Najpierw wbij palik`);if(this.h.combat())return this.h.notify(`Najpierw zakończ walkę`);if(!e.onRope||!Jr(t,n,.18))return this.h.notify(`Stań na tej linie lub przy jej obozie`);if(e.arrived)return this.h.notify(`Drużyna już tu jest`);if(n.coins<e.cost)return this.h.notify(`Potrzebujesz ${e.cost} tix`);this.clearPick(),await this.h.ropeTravel(e.dest,e.cost)}}connectionTarget(){if(!this.rope)return;let e=Gr(this.h.state);return this.h.state.camps.filter(t=>t.id!==this.rope.campId&&u(t,e)<=2.4).sort((t,n)=>u(t,e)-u(n,e))[0]}connectingRoute(){let e=this.connectionTarget();return e&&this.rope?A(this.rope.points,e,this.h.obstacles()):null}placementError(){let e=Gr(this.h.state);if(!this.rope)return``;if(this.h.combat())return`Najpierw zakończ walkę`;let t=this.connectionTarget();if(t){let e=this.connectingRoute();if(!e||k(e)>this.ropeMax())return`Lina nie sięga obozu`;let n=this.rope.campId,r=t.id,i=this.h.state;return i.camps.some(e=>e.id===n&&e.parentId===r||e.id===r&&e.parentId===n)||i.connections?.some(e=>e.from===n&&e.to===r||e.from===r&&e.to===n)?`Obozy są już połączone`:P_(i,r)?``:`Obóz ma już 4 liny`}if(!this.h.contains(e))return`Mapa jeszcze się wczytuje`;let n=Math.min(...this.h.state.camps.map(t=>u(t,e)));return n<or.minCampDistance?`Za blisko obozu — odejdź jeszcze ${Math.ceil((or.minCampDistance-n)/En)} m`:this.h.state.stock.wood<or.campWood?`Potrzebujesz ${or.campWood} drewna`:k(this.rope.points)>this.ropeMax()?`Lina jest za krótka`:this.h.blocked(e,3.6)?`Brak miejsca na obóz`:``}async control(e){let t=this.h.state,n=Gr(t);if(e.id===n.id)return;let r=Ur(t).includes(e.id);if(_r(e.role)){this.h.notify(`${e.name} pracuje w obozie`);return}if(this.rope||this.h.combat()||!r&&!Kr(t,n)){this.h.notify(this.h.combat()?`Najpierw zakończ walkę`:`Wróć do obozu`);return}r||(t.party=[e.id,...Ur(t).filter(e=>e!==n.id),n.id].slice(0,3));let i=t.activeId;t.activeId=e.id,this.h.save();try{await this.h.switch(e),this.refreshWorld(),this.close()}catch{t.activeId=i,this.h.notify(`Mapa tej postaci jest niedostępna`)}}ropeUsed(){return this.rope?Math.ceil(k(this.rope.points)/En):0}tautNotice=0;ropeMax(){return lr(this.h.state,En)}freeSpots(){let e=this.h.state,t=Gr(e);if(!this.rope||this.connectionTarget()||e.stock.wood<or.campWood)return[];let n=k(this.rope.points),r=[];for(let i=2;i<=26&&r.length<3;i+=1.5)for(let a=0;a<Math.PI*2&&r.length<3;a+=Math.PI/10){let o={x:t.x+Math.sin(a)*i,z:t.z+Math.cos(a)*i};n+i<=this.ropeMax()&&this.h.contains(o)&&!this.h.blocked(o,3.6)&&e.camps.every(e=>u(e,o)>=or.minCampDistance)&&r.every(e=>u(e,o)>=6)&&r.push(o)}return r}place(){let e=this.placementError();if(e){this.spotList.length?this.spotPulse=1:this.h.notify(e);return}let t=Gr(this.h.state),n=this.h.state,r=this.connectionTarget();if(r){let e=this.connectingRoute();e&&Yr(n,this.rope.campId,r.id,e)&&(ur(n,k(e),En),this.rope=null,this.refreshWorld(),this.h.save(),this.h.notify(`Obozy połączone`));return}let i={id:Ir(n,`camp`),x:t.x,z:t.z,parentId:this.rope.campId,route:this.rope.points.map(e=>({x:e.x,z:e.z})),buildings:0};n.camps.push(i),t.campId=i.id,n.stock.wood-=or.campWood,ur(n,k(i.route),En),this.rope=null,this.countBuildings(),this.rising.set(i.id,0),this.refreshWorld(),this.h.save(),this.h.campPitched(i)}refusedStep=null;moveAllowed(e){if(!this.rope)return!0;let t=this.refusedStep;if(t&&performance.now()<t.until&&Math.hypot(e.x-t.x,e.z-t.z)<.2)return!1;let n=A(this.rope.points,e,this.h.obstacles());if(!n)return this.refusedStep={x:e.x,z:e.z,until:performance.now()+300},!1;let r=k(n);return r>this.ropeMax()&&r>k(this.rope.points)?(Date.now()-this.tautNotice>2500&&(this.tautNotice=Date.now(),this.h.notify(this.ropeMax()<or.ropeLength?`Skończyła się lina — wbij palik albo wróć`:`Lina napięta (${Math.round(or.ropeLength/En)} m) — wbij palik`)),!1):(this.rope.points=n,!0)}cancelRope(){this.rope=null}countBuildings(){for(let e of this.h.state.camps){if(!this.h.contains(e))continue;let t=new Set;this.h.obstacles().forEach((n,r)=>{let i=n.rings[0],a=i.reduce((e,t)=>e+t[0],0)/i.length,o=i.reduce((e,t)=>e+t[1],0)/i.length;u(e,{x:a,z:o})<or.safeRadius&&t.add(n.id??`building-${r}`)}),e.buildings=t.size}}refreshWorld(){ee(this.h.state),this.h.scene.remove(this.territory),this.disposeGeometry(this.territory),this.territory=r_(this.h.state,this.h.contains),this.h.drape(this.territory),this.h.scene.add(this.territory);for(let e of this.campViews.values())this.group.remove(e),this.disposeGeometry(e);this.campViews.clear();for(let e of this.h.state.camps){if(!this.h.contains(e))continue;let t=Cv(e);t.position.y=this.h.ground(e.x,e.z),this.campViews.set(e.id,t),this.group.add(t)}for(let e of this.waiting.values())this.group.remove(e.root),this.disposeGeometry(e.root);this.waiting.clear();for(let e of this.h.state.characters){if(Ur(this.h.state).includes(e.id)||!this.h.contains(e))continue;let t=O_(e.role===`archer`?`archer`:`hero`,e.appearance,d_(e));t.root.position.set(e.x+2.4,this.h.ground(e.x+2.4,e.z),e.z),t.sword.visible=e.weapon===`sword`,t.wand.visible=e.weapon===`magic`,this.waiting.set(e.id,t),this.group.add(t.root)}let e=[];for(let t of M(this.h.state)){let n=wv(t,0,!1);for(let t=1;t<n.length;t++)this.h.contains(n[t])&&this.h.contains(n[t-1])&&e.push(n[t-1],n[t])}this.connections.geometry.dispose(),this.connections.geometry=new Nc().setFromPoints(e.map(e=>e.clone().setY(e.y+this.h.ground(e.x,e.z)))),hv(`characters`).setAttribute(`aria-label`,`Wędrowcy · ${Gr(this.h.state).name}`)}disposeGeometry(e){e.traverse(e=>{e instanceof W&&e.geometry.dispose()})}tick(e,t){this.clock+=e;let n=this.h.state,r=Gr(n);this.selected=Kr(n,r),hv(`action-label`).textContent=this.rope?this.connectionTarget()?`Połącz obozy`:this.canRollBack()?`Zwiń linę`:`Rozstaw obóz`:this.selected?`Otwórz obóz`:`Akcja`,hv(`action`).hidden=!this.rope&&!this.selected,hv(`action`).classList.toggle(`active`,!!this.rope||!!this.selected),hv(`action`).classList.toggle(`blocked`,!!this.rope&&!!this.placementError()),this.pick&&this.positionPick();for(let[t,n]of this.rising){let r=n+e,i=this.campViews.get(t);if(r>=1.2?this.rising.delete(t):this.rising.set(t,r),i){let e=Math.min(1,r/1.2),t=1-(1-e)**3+Math.sin(e*Math.PI)*.12;i.scale.set(1,Math.max(.02,t),1),i.rotation.y=(1-e)*.6}}for(let[e,n]of this.campViews){let r=n.userData.highlight;r.visible=e===this.selected?.id,r.material.opacity=.45+Math.sin(t*3)*.15}if(this.marker.visible=!!this.rope,this.rope){let e=this.connectionTarget()??r;this.marker.position.set(e.x,.09+this.h.ground(e.x,e.z),e.z),this.marker.material.color.set(this.placementError()?11893609:14927220),this.clock>.05&&(this.liveLine.geometry.dispose(),this.liveLine.geometry=new Nc().setFromPoints(wv(this.rope.points,t,!0).map(e=>e.setY(e.y+this.h.ground(e.x,e.z)))))}if(this.liveLine.visible=!!this.rope,this.spotPulse=Math.max(0,this.spotPulse-e*1.5),this.spots.children.forEach((e,n)=>{let r=this.spotList[n];e.visible=!!r,r&&(e.position.set(r.x,.08+this.h.ground(r.x,r.z),r.z),e.scale.setScalar(1+Math.sin(t*4)*.04+this.spotPulse*.25))}),this.clock>.25){let e=this.rope?this.placementError():``;this.spotList=e===`Brak miejsca na obóz`?this.freeSpots():[],this.clock=0,this.noticeClock+=.25,this.positionMenu();let t=new Map(n.offers.filter(e=>e.candidates===null).map(e=>[e,ti(e).length]));if(ni(n)){this.h.save();let e=0,n=!1;for(let[r,i]of t){let t=ti(r).length;e+=t-i,r.candidates?.length===0&&(n=!0)}e?this.h.notify(e>1?`Nowi chętni zgłosili się do rekrutacji`:`Ktoś zgłosił się do rekrutacji`):n&&this.h.notify(`Brak zgłoszeń do rekrutacji`),this.view===`recruit`&&this.render()}else if(this.view===`recruit`&&n.offers.length>0&&this.noticeClock>=1){this.noticeClock=0;let e=ai(n,(this.menuCamp??Kr(n,r))?.id),t=document.getElementById(`offer-timer`);if(e&&t){let n=Math.max(0,Math.ceil((e.readyAt-Date.now())/1e3));t.textContent=`${Math.floor(n/60)}:${String(n%60).padStart(2,`0`)}`;let r=document.getElementById(`offer-bar`);r&&(r.style.width=`${xv(e)}%`)}}let i=this.h.worldStatus(),a=hv(`world-state`);a.hidden=!i.error&&!i.loading,a.textContent=i.error?`Mapa niedostępna · ponów`:`Wczytywanie mapy…`,hv(`characters`).classList.toggle(`has-candidates`,n.offers.some(e=>ti(e).length>0))}}reproject(e){for(let t of this.h.state.characters)Object.assign(t,e(t));for(let t of this.h.state.camps)Object.assign(t,e(t)),t.route=t.route.map(e);for(let t of this.h.state.connections??[])t.route=t.route.map(e);ee(this.h.state),this.cancelRope()}},Dv=[],Ov=[],kv=[],Av=0,jv=0,Mv=performance.now(),Nv=new Date;window.addEventListener(`error`,e=>Pv(`${e.message} @ ${e.filename}:${e.lineno}`)),window.addEventListener(`unhandledrejection`,e=>Pv(`Promise: ${String(e.reason)}`));function Pv(e){Ov.push(`${new Date().toISOString().slice(11,19)} ${e}`),Ov.length>15&&Ov.shift()}function Fv(e,t){let n=e*1e3;Av++,jv=Math.max(jv,n),n>80&&(Dv.push({at:new Date().toISOString().slice(11,19),ms:Math.round(n),context:t()}),Dv.length>40&&Dv.shift());let r=performance.now();if(r-Mv>=1e3){let e=Math.round(Av*1e3/(r-Mv));kv.push({fps:e,worst:Math.round(jv)}),kv.length>120&&kv.shift();let t=document.getElementById(`perf-fps`);t&&(t.textContent=String(e),t.parentElement.classList.toggle(`low`,e<25)),Av=0,jv=0,Mv=r}}var Iv=`feat/camps-world 762aaa8`;async function Lv(){try{let e=await fetch(`./version.txt`,{cache:`no-store`}),t=(await e.text()).trim();return e.ok&&t.length<120&&!t.startsWith(`<`)?t:``}catch{return``}}async function Rv(){let e=await Lv();if(e&&!e.startsWith(`feat/camps-world 762aaa8`))try{if(sessionStorage.getItem(`ropexpanse-reloaded-for`)===e)return;sessionStorage.setItem(`ropexpanse-reloaded-for`,e),await fetch(location.href,{cache:`reload`}),location.reload()}catch{}}async function zv(e){let t=await Lv(),n=t&&!t.startsWith(`feat/camps-world 762aaa8`)?`${Iv} — STARA KOPIA w przeglądarce (opublikowana: ${t}); odśwież Ctrl+F5`:t||`feat/camps-world 762aaa8`,r=kv.slice(-30),i=r.length?Math.round(r.reduce((e,t)=>e+t.fps,0)/r.length):0;return[`ROPExpanse — raport błędu`,`Wersja: ${n}`,`Czas: ${new Date().toISOString()} (gra od ${Nv.toISOString().slice(11,19)})`,`Urządzenie: ${navigator.userAgent}`,`Ekran: ${innerWidth}×${innerHeight} @${devicePixelRatio} · ${screen.orientation?.type??``}`,...Object.entries(e).map(([e,t])=>`${e}: ${typeof t==`string`?t:JSON.stringify(t)}`),``,`FPS (ostatnie 30 s): średnio ${i}, najgorsza klatka ${Math.max(0,...r.map(e=>e.worst))} ms`,`FPS co sekundę: ${kv.slice(-60).map(e=>e.fps).join(` `)}`,``,`Zacięcia > 80 ms (${Dv.length}):`,...Dv.map(e=>`  ${e.at} ${e.ms} ms · ${e.context}`),``,`Błędy (${Ov.length}):`,...Ov.map(e=>`  ${e}`)].join(`
`)}function Bv(e,t){let n=2166136261;for(let r of`${e}:${t}`)n=Math.imul(n^r.charCodeAt(0),16777619);return n^=n>>>16,n=Math.imul(n,2146121005),n^=n>>>15,(n>>>0)/4294967296}var Vv=or.quietBorderMeters;function Hv(e){return e<50?0:Math.min(1,.15+.85*((e-50)/(Vv-50)))}function Uv(e,t,n,r){let i=qr(e,t,r)/r;return Bv(n,`density`)<Hv(i)}function Wv(e,t,n){let r=e.camps[0],i=u(r,t)/n,a=qr(e,t,n)/n,o=Math.min(1,a/250),s=1+Math.floor(i/1e3/15);return{tier:Math.min(100,s+Math.floor(a/350)),worldTier:s,rootMeters:i,frontierMeters:a,bossChance:i<1e3||a<250?0:Math.min(.08,.005+(a-250)/2e4+i/2e6),eliteChance:a<300?.02:Math.min(.32,.04+o*.12+(a-300)/4e3)}}function Gv(e,t,n,r){let i=Wv(e,t,r),a=Bv(n,`boss`)<i.bossChance,o=a||Bv(n,`elite`)<i.eliteChance;return{...i,boss:a,elite:o}}var Kv={sword:`<path d="m8 21 13-13 3-1-1 4L10 24M6 17l9 9M9 22l-4 5m-2-2 4 4"/>`,magic:`<path d="m6 26 14-14m-3-4 3-5 3 5 5 3-5 3-3 5-3-5-5-3 5-3ZM5 5v6m-3-3h6m17 14v6m-3-3h6"/>`,sweep:`<path d="M4 23C5 9 22 3 29 12M4 23l2-9m-2 9 9-3M12 26 25 13m-7-1 9 9"/>`,potion:`<path d="M12 4h8m-7 0v8L7 23q-3 6 5 6h8q8 0 5-6l-6-11V4M10 20h12"/><path d="M16 20v6m-3-3h6"/>`,fullscreen:`<path d="M4 12V4h8m8 0h8v8m0 8v8h-8M12 28H4v-8"/>`,compass:`<path d="m16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z"/><path d="m12 20 8-8-2 6-6 2Z"/>`,goggles:`<circle cx="10" cy="17" r="6"/><circle cx="24" cy="17" r="6"/><path d="M16 16h2M4 14 2 8m28 6 2-6M8 11V8h18v3"/>`,charge:`<path d="M4 17h14m-6-6 6 6-6 6M20 9l10 8-10 8"/>`,whirl:`<path d="M17 5a12 12 0 1 1-11 8m11-8-4 4m4-4 4 4"/><path d="m12 17 10-6-4 11Z"/>`,quake:`<path d="M3 26h28M8 26l3-6 3 3 3-8 3 6 2-3 4 8M17 4v7m-5-4 5 4 5-4"/>`,fireball:`<circle cx="20" cy="20" r="7"/><path d="M14 15 4 5m11 4L9 3m10 6-3-6M15 20H5"/>`,volley:`<path d="M5 29 26 8m-5 0h5v5M5 29l12-21m-4 1 4-1 1 4M5 29 29 19m-4-3 4 3-3 3"/>`,heal:`<path d="M17 29S4 21 4 12a6 6 0 0 1 13-3 6 6 0 0 1 13 3c0 9-13 17-13 17Z"/><path d="M17 13v8m-4-4h8"/>`,taunt:`<path d="M17 4 28 8v8c0 7-5 11-11 14C11 27 6 23 6 16V8Z"/><path d="M13 13l8 8m0-8-8 8"/>`,manaShield:`<circle cx="17" cy="17" r="12"/><path d="m17 9 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/>`};function qv(e){return`<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Kv[e]||Kv.compass}</svg>`}var Jv=``;function Yv(){let e=document.getElementById(`attack-stick`);if(!e)return;let t=[`sweep`,`skill2`,`heal`].map(e=>document.getElementById(e)).filter(e=>!!e&&!e.hidden),n=document.getElementById(`action`),r=!!n&&!n.hidden,i=e.getBoundingClientRect(),a=document.querySelector(`.loadout`),o=document.getElementById(`expedition-tools`),s=a?.getBoundingClientRect(),c=`${s?`${s.left},${s.top},${s.height}|${o?.offsetWidth}`:``}${innerWidth}x${innerHeight}|${i.left},${i.top},${i.width}|${t.map(e=>e.id+e.offsetWidth).join()}|${r?n.offsetWidth+`x`+n.offsetHeight:`-`}`;if(c===Jv)return;Jv=c;let l=i.left+i.width/2,u=i.top+i.height/2,d=Math.max(...t.map(e=>e.offsetWidth),0),f=t.length?90/t.length:90,p=Math.max(i.width/2+10+d/2,(d+10)/(2*Math.sin(f*Math.PI/360)));if(t.forEach((e,t)=>{let n=(180-t*f)*Math.PI/180,r=e.offsetWidth,i=e.offsetHeight;Object.assign(e.style,{left:`${l+p*Math.cos(n)-r/2}px`,top:`${u-p*Math.sin(n)-i/2}px`,right:`auto`,bottom:`auto`})}),s&&o&&Object.assign(o.style,{left:`${s.left-8-o.offsetWidth}px`,top:`${s.top+(s.height-o.offsetHeight)/2}px`,right:`auto`,transform:`none`}),r){let e=n.offsetWidth,t=n.offsetHeight;Object.assign(n.style,{left:`${l-e/2}px`,top:`${u-Math.max(p,i.height/2+10+t/2)-t/2}px`,right:`auto`,bottom:`auto`})}}function Xv(){document.querySelectorAll(`[data-icon]`).forEach(e=>{e.innerHTML=qv(e.dataset.icon)})}Rv(),Xv();var q=e=>document.getElementById(e),Zv=`ropexpanse:campaign:v2`,Qv=`exp-lore:combat3d:v1`,$v={lat:51.2482,lon:22.5681},ey=null;try{let e=localStorage.getItem(Zv);e&&(ey=si(e))}catch{}var J=ey??Hr({x:15,z:-13},$v),ty,Y,ny=new H,ry=0,iy=!1,X=new zs;X.background=new U(13358520),X.fog=new Rs(13358520,55,115);var ay=q(`world`),oy,sy=new URLSearchParams(location.search).get(`quality`)===`safe`,cy=sy||matchMedia(`(pointer: coarse)`).matches||new URLSearchParams(location.search).get(`quality`)===`low`,ly=!1,uy=``,dy=3,fy=!1,py=`idle`;function my(e){uy=e,fy=!1,Gw(),Hb(),q(`renderer-error-text`).textContent=e,q(`renderer-details`).textContent=`Tryb ${cy?`zgodności`:`standardowy`} · ${location.protocol} · ${innerWidth}×${innerHeight} · próba 03`,q(`renderer-error`).hidden=!1}var hy=typeof matchMedia==`function`&&(matchMedia(`(display-mode: fullscreen)`).matches||matchMedia(`(display-mode: standalone)`).matches);async function gy(){if(!document.fullscreenElement){if(hy)py=`app`;else if(!document.documentElement.requestFullscreen)py=`unavailable`;else{py=`requesting`;try{await document.documentElement.requestFullscreen({navigationUI:`hide`}),py=`active`;let e=screen.orientation;if(matchMedia(`(pointer: coarse)`).matches)try{await e.lock?.(`landscape`)}catch{}}catch{py=`unavailable`}Cy&&(Zw(),dy=3)}}}function _y(){let e=oy.getContext();if(e.isContextLost())return;let t=new Set,n=new Uint8Array(4);for(let r of[.2,.5,.8])for(let i of[.2,.5,.8])e.readPixels(Math.floor(e.drawingBufferWidth*r),Math.floor(e.drawingBufferHeight*i),1,1,e.RGBA,e.UNSIGNED_BYTE,n),n[3]&&t.add(`${n[0]},${n[1]},${n[2]}`);fy=t.size>1,!fy&&dy===1&&my(`Interfejs działa, ale przeglądarka nie wyświetla świata 3D. Spróbuj trybu zgodności lub otwórz grę bezpośrednio w Chrome.`)}var vy=new mf(-25,25,25,-25,.1,220),Z=Gr(J),yy=O_(Z.role===`archer`?`archer`:`hero`,Z.appearance,d_(Z)),by=()=>Nr(Z),xy=`sword`,Q,Sy={x:0,z:0},Cy=!1,wy=!1,Ty=!1,Ey=!1,$=0,Dy=-100,Oy=-100,ky=0,Ay=0,jy=0,My=0,Ny=0,Py=Math.PI,Fy=null,Iy=0;function Ly(){$<Iy||(Iy=$+3,zb(`W strefie bezpiecznej nie walczysz`))}var Ry=null,zy={x:0,z:0},By=new Set,Vy=!1,Hy=0,Uy=0,Wy=0,Gy=[],Ky=0,qy=0,Jy=[],Yy=[],Xy=[],Zy=[],Qy=[],$y=48,eb=new kd({vertexColors:!0});eb.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float aFade;
varying float vFade;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vFade = aFade;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vFade;`).replace(`void main() {`,`void main() {
  if (vFade < 0.999) { vec2 q = floor(gl_FragCoord.xy); if (fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453) > vFade) discard; }`)};var tb=new Map,nb=new WeakMap,rb=0;function ib(e){let t=nb.get(e);if(t)return t;let n=new cd(Wb(e.rings),{depth:1,bevelEnabled:!1});n.rotateX(-Math.PI/2);let r=n.getAttribute(`position`).array.slice(),i=n.getAttribute(`normal`).array.slice(),a=r.length/3,o=e.rings[0],s={x0:1/0,x1:-1/0,z0:1/0,z1:-1/0};for(let e=0;e<a;e++)r[e*3+1]=+(r[e*3+1]>.5);let c=0,l=0;for(let e of o)c+=e[0],l+=e[1],e[0]<s.x0&&(s.x0=e[0]),e[0]>s.x1&&(s.x1=e[0]),e[1]<s.z0&&(s.z0=e[1]),e[1]>s.z1&&(s.z1=e[1]);return t={serial:++rb,pos:r,nor:i,count:a,wallsFrom:n.groups[1]?.start??a,box:s,cx:c/o.length,cz:l/o.length,chunk:`${Math.floor((s.x0+s.x1)/2/$y)},${Math.floor((s.z0+s.z1)/2/$y)}`},n.dispose(),nb.set(e,t),t}var ab=[],ob=5,sb=0,cb=0;function lb(e){for(let t of e)nb.has(t)||ab.push(t);ab.length&&!sb&&(cb||=performance.now(),sb=window.setTimeout(ub,0))}function ub(){sb=0;let e=performance.now()+ob;for(;ab.length&&performance.now()<e;)ib(ab.pop());ab.length?sb=window.setTimeout(ub,ob):cb=0}function db(e,t){let n=new Xn(e,t);return n.onTile=e=>lb(e.buildings),n}var fb=()=>ab.length>0&&performance.now()-cb<6e3,pb=new Map,mb=new H,hb=new U,gb=new U,_b=new Float32Array(1),vb=new Int32Array(_b.buffer),yb=(e,t)=>(_b[0]=t,Math.imul(e^vb[0],16777619));function*bb(){let e=xx.walls,t=xx.roofs,n=Mx.w?.5:0,r=new Map;Q.buildings.forEach((e,t)=>{let i=ib(e),a=Lx(i.cx,i.cz),o=-1/0;for(let t of e.rings[0]){let e=Lx(t[0],t[1]);e<a&&(a=e),e>o&&(o=e)}let s=e.id?In(e.id):t,c=r.get(i.chunk);c||r.set(i.chunk,c={seats:[],count:0,signature:n?7:3}),c.seats.push({b:e,p:i,low:a,high:o,tint:s}),c.count+=i.count,c.signature=yb(yb(yb(c.signature,i.serial),a),o)});let i=new Map;for(let[a,o]of r){let r=pb.get(a);if(r?.signature!==o.signature){OS()&&(yield);let i=new Float32Array(o.count*3),a=new Float32Array(o.count*3),s=new Float32Array(o.count*3),c=[],l=0;for(let{b:r,p:u,low:d,high:f,tint:p}of o.seats){let o=d-n,m=o+r.height+(f-d)+n,h=.7+.3*Math.min(1,Math.max(0,(m-d)/1.6)),g=l*3;gb.setHex(t[p%t.length]),hb.setHex(e[p%e.length]),a.set(u.nor,g),i.set(u.pos,g);for(let[e,t,n]of[[0,u.wallsFrom,gb],[u.wallsFrom,u.count,hb]]){let r=n.r,a=n.g,c=n.b;for(let n=g+e*3,l=g+t*3;n<l;n+=3){let e=i[n+1]>0,t=e?h:.7;i[n+1]=e?m:o,s[n]=r*t,s[n+1]=a*t,s[n+2]=c*t}}c.push({data:r,chunk:null,start:l,count:u.count,fade:1,lit:!0,top:f+r.height,ring:r.rings[0],box:u.box}),l+=u.count}let u=new Nc;u.setAttribute(`position`,new vc(i,3)),u.setAttribute(`normal`,new vc(a,3)),u.setAttribute(`color`,new vc(s.slice(),3)),u.setAttribute(`aFade`,new vc(new Float32Array(o.count).fill(1),1)),u.computeBoundingSphere();let d=new W(u,eb);d.castShadow=!0,d.receiveShadow=!0,r={mesh:d,base:s,signature:o.signature,views:c};for(let e of c)e.chunk=r;yS(c)}i.set(a,r)}return()=>{for(let[e,t]of pb)i.get(e)!==t&&(mb.remove(t.mesh),t.mesh.geometry.dispose());pb.clear(),Qy.length=0;for(let[e,t]of i){t.mesh.parent||mb.add(t.mesh),pb.set(e,t);for(let e of t.views)Qy.push(e)}tb.clear();for(let e of Qy)for(let t=Math.floor((e.box.x0-2)/8);t<=Math.floor((e.box.x1+2)/8);t++)for(let n=Math.floor((e.box.z0-2)/8);n<=Math.floor((e.box.z1+2)/8);n++){let r=`${t},${n}`,i=tb.get(r);i?i.push(e):tb.set(r,[e])}}}var xb=[],Sb=new Map,Cb=new kd({vertexColors:!0}),wb=4;function Tb(){let e=new H;e.visible=!1;let t=new Ul(.01,.01,.01);for(let n of[Cb,new kd({color:16777215})]){let r=new W(t,n);r.receiveShadow=r.castShadow=!0,e.add(r)}X.add(e);for(let e of[!0,!1]){let n=new ml(t,l_(16777215),1);n.setMatrixAt(0,new rs().makeTranslation(0,-50,0)),e&&n.setColorAt(0,new U(16777215)),n.castShadow=!0,n.frustumCulled=!1,X.add(n)}}var Eb=new WeakMap;function Db(e){let t=e*5;for(let e of Qy){let n=(Eb.get(e)??-1)>$?.15:1;if(e.fade===n)continue;e.fade=n<e.fade?Math.max(n,e.fade-t):Math.min(n,e.fade+t);let r=e.chunk.mesh.geometry.getAttribute(`aFade`);r.array.fill(e.fade,e.start,e.start+e.count),r.needsUpdate=!0}}var Ob=new WeakMap,kb=0;function Ab(e=!1){let t=performance.now();if(!e&&t-kb<1e3)return;kb=t;let n=[];X.traverse(e=>{if(!(e instanceof W||e instanceof Dl||e instanceof Ll))return;let t=e instanceof ml?e.instanceColor?4:2:1;for(let r of Array.isArray(e.material)?e.material:[e.material]){let i=Ob.get(r)??0;i&t||(Ob.set(r,i|t),n.at(-1)!==e&&n.push(e))}});for(let e of n)try{oy.compile(e,vy,X)}catch{}}var jb=(e,t)=>`${Math.floor(e/8)},${Math.floor(t/8)}`,Mb=new V,Nb=new Pf,Pb=new Lc(new V(0,1,0),0),Fb=new V,Ib=j_(c.reach,c.halfArc,16770723,.23);Ib.position.y=.065,X.add(Ib),Ib.visible=!1;var Lb,Rb=!1;function zb(e){q(`toast`).textContent=e,q(`toast`).classList.add(`on`),Wy=$+3.2}function Bb(e,t=.06,n=`triangle`,r=.055){if(!Rb||!Lb)return;let i=Lb,a=i.createOscillator(),o=i.createGain();a.type=n,a.frequency.setValueAtTime(e,i.currentTime),a.frequency.exponentialRampToValueAtTime(e*.45,i.currentTime+t),o.gain.setValueAtTime(r,i.currentTime),o.gain.exponentialRampToValueAtTime(.001,i.currentTime+t),a.connect(o),o.connect(i.destination),a.start(),a.stop(i.currentTime+t)}function Vb(){try{Lb??=new AudioContext,Lb.resume()}catch{Rb=!1}}function Hb(){if(!(!Cy||My>$))try{Z.weapon=xy,Z.sweepReady=Math.max(0,ky-$),Z.potionReady=Math.max(0,Ay-$);for(let e in J.encounters)J.encounters[e]<Date.now()&&delete J.encounters[e];localStorage.setItem(Zv,JSON.stringify(J))}catch{$-Wy>10&&zb(`Nie można zapisać postępu w tej przeglądarce`)}}function Ub(){if(!ey)try{let e=JSON.parse(localStorage.getItem(Qv)||`null`);if(e?.v===1){for(let t of[`exp`,`kills`,`fragments`,`coins`])Number.isFinite(e[t])&&(Z[t]=Math.max(0,e[t]));Number.isFinite(e.x)&&Number.isFinite(e.z)&&!Gb(e.x,e.z,c.radius)&&(Z.x=e.x,Z.z=e.z),Z.hp=Math.max(1,Math.min(by(),Number(e.hp)||100)),Z.weapon=e.weapon===`magic`?`magic`:`sword`}}catch{}xy=Z.weapon,ky=$+(Z.sweepReady??0),Ay=$+(Z.potionReady??0)}function Wb(e){let t=new wu(e[0].map(([e,t])=>new B(e,-t)));for(let n of e.slice(1))t.holes.push(new Cu(n.map(([e,t])=>new B(e,-t))));return t}function Gb(e,t,n=.4){if(!Q||(Y?!Y.contains({x:e,z:t},n+1):Math.abs(e)>Q.radius-2||Math.abs(t)>Q.radius-2))return!0;for(let r of tb.get(jb(e,t))??[]){let i=r.box;if(!(e<i.x0-n||e>i.x1+n||t<i.z0-n||t>i.z1+n)&&h({x:e,z:t},n,r.data.rings))return!0}return dS(e,t,n)}function Kb(e,t){let n=Math.ceil(u(e,t)/.4);for(let r=1;r<n;r++)if(Gb(e.x+(t.x-e.x)*r/n,e.z+(t.z-e.z)*r/n,.08))return!1;return!0}function qb(e,t,n,r){let i=t=>!Gb(t.x,t.z,r)&&(e!==Z||!ty||ty.moveAllowed(t));i({x:e.x+t,z:e.z})&&(e.x+=t),i({x:e.x,z:e.z+n})&&(e.z+=n)}function Jb(e,t=0){return Jr(J,e,Q?.scale??.18,t)}function Yb(e,t,n){let r=(t,n)=>{let r=Math.max(1,Math.ceil(Math.hypot(t,n)/.1));for(let i=0;i<r;i++){let i={x:e.x+t/r,z:e.z+n/r};if(Gb(i.x,i.z,.48)||!Jb(e,.48)&&Jb(i,.48))break;e.x=i.x,e.z=i.z}};r(t,0),r(0,n)}var Xb=150,Zb=225e3,Qb=5.5;function $b(e,t){let n=e.rig.root.position;if(e.wanderWait-=t,!e.wanderTarget&&e.wanderWait<=0){for(let t=0;t<12;t++){let t=Math.random()*Math.PI*2,r=1.5+Math.random()*5,i={x:e.spawn.x+Math.sin(t)*r,z:e.spawn.z+Math.cos(t)*r};if(!Gb(i.x,i.z,.48)&&(!Jb(i,Qb)||Jb(e.spawn,Qb))&&Kb(n,i)){e.wanderTarget=i;break}}e.wanderWait=.5+Math.random()}if(!e.wanderTarget)return!1;if(u(n,e.wanderTarget)<.3)return e.wanderTarget=null,e.wanderWait=.5+Math.random()*2,!1;e.heading=Math.atan2(e.wanderTarget.x-n.x,e.wanderTarget.z-n.z);let r={x:n.x,z:n.z};Yb(n,Math.sin(e.heading)*1.2*t,Math.cos(e.heading)*1.2*t);let i=u(r,n)>1e-4;return i||(e.wanderTarget=null),i}function ex(e,t=.75){if(!Gb(e.x,e.z,t))return{...e};for(let n=.5;n<30;n+=.65)for(let r=0;r<Math.PI*2;r+=.32){let i={x:e.x+Math.sin(r)*n,z:e.z+Math.cos(r)*n};if(!Gb(i.x,i.z,t))return i}throw Error(`Nie znaleziono przejścia na mapie`)}function tx(e=1.3,t=12179345){let n=new H,r=new W(new pd(e+.12,.3),new Gc({color:2438189,depthTest:!1})),i=new W(new pd(e,.2),new Gc({color:t,depthTest:!1}));return i.position.z=.01,n.add(r,i),n.renderOrder=10,{group:n,fill:i}}var nx=tx(1.4);X.add(nx.group);var rx,ix,ax=new pf(16761466,0,18,1.3),ox=new pf(16757575,0,16,1.4),sx=99,cx=new URLSearchParams(location.search).get(`time`);function lx(e){if(sx+=e,sx>30){sx=0;let e=Mn(Z,J.origin),t=cx??ug(Date.now(),e.lat,e.lon);t!==dw&&(dw=t,zb(t===`night`?`Zapada noc — Mgła gęstnieje`:t===`twilight`?`Zmierzch`:`Dzień`))}let t=dg[dw],n=Math.min(1,e*1.5),r=fw===`rain`||fw===`storm`?.65:fw===`fog`?.82:1;rx.position.set(Z.x+bx.x,bx.y,Z.z+bx.z),rx.target.position.set(Z.x,0,Z.z),rx.intensity+=(t.sun*r-rx.intensity)*n,rx.color.lerp(new U(t.sunColor),n),ix.intensity+=(t.sky*(r<1?.9:1)-ix.intensity)*n,px>0&&(ix.intensity=t.sky+px/.18*5),ix.color.lerp(new U(t.skyColor),n),ix.groundColor.lerp(new U(t.ground),n),X.background.lerp(new U(t.fog),n),X.fog.color.lerp(new U(t.fog),n),ax.intensity+=(t.lamp-ax.intensity)*n,ax.position.set(Z.x,2.4,Z.z),ox.intensity+=(t.lamp*1.3-ox.intensity)*n,ox.position.set(Sy.x,1.4,Sy.z)}var ux=new URLSearchParams(location.search).get(`weather`),dx=1/0,fx=0,px=0,mx=700,hx=new jl(new Nc().setAttribute(`position`,new vc(new Float32Array(mx*6),3)),new yl({color:12375014,transparent:!0,opacity:.55})),gx=new Ll(new Nc().setAttribute(`position`,new vc(new Float32Array(mx*3),3)),new Ml({color:16777215,size:4,sizeAttenuation:!1,transparent:!0,opacity:.95}));hx.frustumCulled=gx.frustumCulled=!1,hx.visible=gx.visible=!1;var _x=Array.from({length:mx},(e,t)=>[t*7919%1e3/1e3,t*104729%1e3/1e3,t*1299709%1e3/1e3]);function vx(e){e!==fw&&(fw=e,zb(Ig[e]))}function yx(e){if(dx+=e,dx>60){if(dx=0,ux)vx(ux);else{let e=Mn(Z,J.origin);Fg(e.lat,e.lon).then(vx)}}let t=fw===`rain`||fw===`storm`;hx.visible=t,gx.visible=fw===`snow`;let n=fw===`fog`?36:t?50:55,r=fw===`fog`?72:t?102:115,i=X.fog;if(i.near+=(n-i.near)*Math.min(1,e),i.far+=(r-i.far)*Math.min(1,e),hx.visible||gx.visible){let e=$,t=fw===`storm`?.35:.12,n=(hx.visible?hx:gx).geometry.getAttribute(`position`).array;for(let r=0;r<mx;r++){let[i,a,o]=_x[r],s=18-(e*(hx.visible?22:2.2)+o*18)%18,c=Z.x+(i-.5)*60+(hx.visible?t*s:Math.sin(e+o*6)*.6),l=Z.z+(a-.5)*60;hx.visible?n.set([c,s,l,c-t*.9,s+.9,l],r*6):n.set([c,s,l],r*3)}(hx.visible?hx:gx).geometry.getAttribute(`position`).needsUpdate=!0}fw===`storm`&&$>fx&&(fx=$+8+Math.random()*10,px=.18,Bb(60,.4,`sawtooth`,.03)),px=Math.max(0,px-e)}var bx=new V(-32,58,16),xx={water:6135736,green:7313989,ground:10334316,road:15128760,path:13613970,walls:[15260864,14733486,15458762,14469798,14997176],roofs:[12083006,11097401,12741448,10243895,11822150]};function Sx(){let e=new gf(16772816,2.4);rx=e,e.position.set(bx.x,bx.y,bx.z),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.left=-55,e.shadow.camera.right=55,e.shadow.camera.top=55,e.shadow.camera.bottom=-55,e.shadow.normalBias=.06,e.shadow.bias=-2e-4,X.add(e,e.target),ix=new Qd(15069919,7042391,2),X.add(ix,ax,ox,hx,gx),Tb(),X.add(ny,mb,SS),kS(),ey?Sy=J.camps.find(e=>e.id===Z.campId)??J.camps[0]:(Sy=ex({x:15,z:-13},3.6),Object.assign(J.camps[0],Sy),Object.assign(Z,Sy)),X.add(yy.root),uw(yy),lw(yy),Ub(),$C(),yw(xy),Fb.set(Z.x,0,Z.z)}var Cx=0,wx=0,Tx=Math.PI/4;function Ex(e,t){let n=Math.cos(Cx),r=Math.sin(Cx);return{x:e*n+t*r,z:-e*r+t*n}}function Dx(e){return Math.round(e/Tx)*Tx}function Ox(e){wx=Dx(wx+e)}function kx(){let e=document.getElementById(`compass`);if(!e)return;let t=Math.abs(Math.atan2(Math.sin(wx),Math.cos(wx)))>.01;e.hidden=!t,t&&(e.firstElementChild.style.transform=`rotate(${Cx}rad)`)}function Ax(e){let t=new Map,n=0,r=0,i=()=>{let[e,n]=[...t.values()];return Math.atan2(n.y-e.y,n.x-e.x)};e.addEventListener(`pointerdown`,e=>{e.pointerType===`touch`&&(t.set(e.pointerId,{x:e.clientX,y:e.clientY}),t.size===2&&(n=i(),r=wx))}),e.addEventListener(`pointermove`,e=>{t.has(e.pointerId)&&(t.set(e.pointerId,{x:e.clientX,y:e.clientY}),t.size===2&&(wx=Cx=r-(i()-n)))});let a=e=>{t.delete(e.pointerId)&&t.size<2&&(wx=Dx(wx))};e.addEventListener(`pointerup`,a),e.addEventListener(`pointercancel`,a)}var jx=new yg,Mx=new wg,Nx=null,Px=null,Fx=!1,Ix=99,Lx=(e,t)=>Mx.at(e,t);function Rx(e){e.updateMatrixWorld(!0),e.traverse(e=>{if(!(e instanceof W||e instanceof Dl))return;let t=e.geometry.getAttribute(`position`);if(!t)return;let n=e.userData.flatY??=Float32Array.from({length:t.count},(e,n)=>t.getY(n)),r=new V;for(let i=0;i<t.count;i++)r.set(t.getX(i),n[i],t.getZ(i)).applyMatrix4(e.matrixWorld),t.setY(i,n[i]+Lx(r.x,r.z));t.needsUpdate=!0,e.geometry.computeBoundingSphere()})}var zx=1/0;function Bx(e=.6){zx=Math.min(zx,$+e)}var Vx=0,Hx=null,Ux=null,Wx=-1,Gx=0,Kx=0,qx=0,Jx=1,Yx=0,Xx=!0;function*Zx(){yield*AS(),yield,ty.countBuildings(),yield,ty.refreshWorld(),VS=null}function Qx(){let e=Gy.reduce((e,t)=>e+t,0)/Math.max(1,Gy.length)*1e3;return Math.max(5,Math.min(25,e*.25))}function $x(){if(Hx){if(Ux!==Q||Wx!==Mx.version){Hx=null,Bx(0);return}ES=performance.now(),DS=Qx();let e=Hx.next().done,t=performance.now()-ES;if(Gx+=t,Kx++,qx=Math.max(qx,t),!e)return;Hx=null,Vx=Math.round(Gx),Jx=Kx,Yx=Math.round(qx)}else $<zx||Fx||fb()&&Xx||(Xx=!!Y?.contains(Z,25),zx=1/0,Hx=Zx(),Ux=Q,Wx=Mx.version,Gx=Kx=qx=0)}var eS=new V;function tS(e){return eS.set(e.x,Lx(e.x,e.z)+1,e.z).project(vy),Math.abs(eS.x)<1.15&&Math.abs(eS.y)<1.15&&eS.z<1}var nS=130,rS=55;function iS(){Ix=99,Nx=null}function aS(e){if(Ix+=e,Fx||Ix<1&&!(Mx.w&&Px!==Q)||(Ix=0,Nx&&Px===Q&&u(Nx,Z)<rS&&Mx.w))return;let t=J.camps[0],n={x:Z.x,z:Z.z},r=nS,i=Mn({x:n.x-r,z:n.z+r},J.origin),a=Mn({x:n.x+r,z:n.z-r},J.origin),o=Mn(t,J.origin);Fx=!0;let s=J.origin,c=Q;Promise.all([jx.ensure({south:i.lat,west:i.lon,north:a.lat,east:a.lon}),jx.ensure({south:o.lat-.001,west:o.lon-.001,north:o.lat+.001,east:o.lon+.001})]).then(()=>{let e=jx.at(o);e!==null&&s===J.origin&&Mx.build(n,r,s,e,jx,Tg(c),c)&&(Nx=n,Px=c,Bx(0))}).finally(()=>Fx=!1)}var oS=null,sS=new Map,cS=8,lS=(e,t)=>(e+32768)*65536+t+32768;function uS(e,t,n=!1){oS!==Q&&(oS=Q,sS=new Map,Q.areas.forEach((e,t)=>{let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let t of e.rings[0])n=Math.min(n,t[0]),r=Math.max(r,t[0]),i=Math.min(i,t[1]),a=Math.max(a,t[1]);for(let e=Math.floor(n/cS);e<=Math.floor(r/cS);e++)for(let n=Math.floor(i/cS);n<=Math.floor(a/cS);n++){let r=lS(e,n),i=sS.get(r);i?i.push(t):sS.set(r,[t])}}));let r=sS.get(lS(Math.floor(e/cS),Math.floor(t/cS)));if(r)for(let i of r){let r=Q.areas[i];if(r.water===n&&m(e,t,r.rings))return r}}function dS(e,t,n){oS!==Q&&uS(e,t);let r=Math.floor((e-n)/cS),i=Math.floor((e+n)/cS),a=Math.floor((t-n)/cS),o=Math.floor((t+n)/cS);for(let s=r;s<=i;s++)for(let r=a;r<=o;r++){let i=sS.get(lS(s,r));if(i)for(let r of i){let i=Q.areas[r];if(i.water&&h({x:e,z:t},n,i.rings))return!0}}return!1}function fS(){let e=Mx.w,t=new Float32Array(e*e*3),n=new Float32Array(e*e*3),r=new U,i=[xx.water,xx.green,xx.ground].map(e=>(r.setHex(e),[r.r,r.g,r.b]));for(let r=0;r<e;r++)for(let a=0;a<e;a++){let o=r*e+a,s=Mx.x0+(a+.5)*2,c=Mx.z0+(r+.5)*2,l=i[Mx.wet[o]?0:uS(s,c)?1:2];t[o*3]=s,t[o*3+1]=Mx.v[o],t[o*3+2]=c,n[o*3]=l[0],n[o*3+1]=l[1],n[o*3+2]=l[2]}let a=new Uint32Array((e-1)*(e-1)*6);for(let t=0,n=0;t<e-1;t++)for(let r=0;r<e-1;r++,n+=6){let i=t*e+r,o=i+1,s=i+e,c=s+1;a[n]=i,a[n+1]=s,a[n+2]=o,a[n+3]=o,a[n+4]=s,a[n+5]=c}let o=new Nc;o.setAttribute(`position`,new vc(t,3)),o.setAttribute(`color`,new vc(n,3)),o.setIndex(new vc(a,1)),o.computeVertexNormals();let s=new W(o,Cb);return s.receiveShadow=!0,s.userData.baseColors=Float32Array.from(n),s.userData.lit=new Uint8Array(e*e),s}var pS=null,mS=new Set,hS=0,gS=(e,t)=>mS.has(Og(Mn({x:e,z:t},J.origin)));function _S(){vS(pS),yS(Qy)}function vS(e){if(e){let t=e.userData.baseColors,n=e.geometry.getAttribute(`color`),r=n.array,i=e.userData.lit,a=Mx.w,o=!1;for(let e=0;e<a*a;e++){if(i[e]===1)continue;let n=e%a,s=gS(Mx.x0+(n+.5)*2,Mx.z0+((e-n)/a+.5)*2);if(i[e]===(s?1:2))continue;i[e]=s?1:2,o=!0;let c=e*3;if(s)r[c]=t[c],r[c+1]=t[c+1],r[c+2]=t[c+2];else{let e=.3*t[c]+.59*t[c+1]+.11*t[c+2];r[c]=t[c]+(e-t[c])*Dg,r[c+1]=t[c+1]+(e-t[c+1])*Dg,r[c+2]=t[c+2]+(e-t[c+2])*Dg}}o&&(n.needsUpdate=!0)}}function yS(e){let t=new Set;for(let n of e){let e=gS((n.box.x0+n.box.x1)/2,(n.box.z0+n.box.z1)/2);if(n.lit===e)continue;n.lit=e;let r=n.chunk.mesh.geometry.getAttribute(`color`).array,i=n.chunk.base;for(let t=n.start*3;t<(n.start+n.count)*3;t+=3)if(e)r[t]=i[t],r[t+1]=i[t+1],r[t+2]=i[t+2];else{let[e,n,a]=Ag(i[t],i[t+1],i[t+2]);r[t]=e,r[t+1]=n,r[t+2]=a}t.add(n.chunk)}for(let e of t)e.mesh.geometry.getAttribute(`color`).needsUpdate=!0}function bS(e){if(hS+=e,hS<1)return;hS=0;let t=kg(mS,Mn(Z,J.origin));for(let e of wC)t+=kg(mS,Mn(e.c,J.origin),60);t&&(J.explored=[...mS],_S())}function xS(){if(!Mx.w)return;let e=(e,t=0)=>{e.position.y=Lx(e.position.x,e.position.z)+t};e(yy.root,My>$?-.1:0);for(let t of wC)e(t.rig.root,t.c.hp<=0?-.1:0),t.bar.position.y=2.6+t.rig.root.position.y;for(let t of Jy)e(t.rig.root),t.bar.position.y=(t.kind===`wolf`?1.8:2.8)+t.rig.root.position.y,t.warning.position.y=.07+t.rig.root.position.y;for(let{view:t}of zS.values())e(t);for(let t of RC.values())e(t.view);for(let t of GC.values())e(t.rig.root),t.mark.position.y+=t.rig.root.position.y;ax.position.y=2.4+yy.root.position.y,ox.position.y=1.4+Lx(Sy.x,Sy.z)}var SS=new H;function CS(e){e.traverse(e=>{e instanceof W&&e.geometry.dispose()}),e.clear()}var wS=0,TS=[],ES=0,DS=1/0,OS=()=>performance.now()-ES>DS;function kS(){Hx=null,DS=1/0;for(let e of AS());}function*AS(){let e=[],t=new W(new pd(1400,1400),l_(xx.ground));t.rotation.x=-Math.PI/2,t.position.set(Z.x,Mx.w?Mx.low()-.02:0,Z.z),t.receiveShadow=!0,e.push(t);let n=null;if(Mx.w)e.push(n=fS()),vS(n);else for(let t of Q.areas){let n=new W(new hd(Wb(t.rings)),l_(t.water?xx.water:xx.green));n.rotation.x=-Math.PI/2,n.position.y=.014,n.receiveShadow=!0,e.push(n)}yield;let r={road:{pos:[],idx:[]},path:{pos:[],idx:[]}};for(let e of Q.roads){OS()&&(yield);let t=e.path?r.path:r.road,n=e.path?.03:.045,i=e.width/2;for(let r=1;r<e.pts.length;r++){let[a,o]=e.pts[r-1],[s,c]=e.pts[r],l=s-a,u=c-o,d=Math.hypot(l,u);if(d<.02)continue;let f=l/d,p=u/d,m=-p*i,h=f*i,g=Mx.w?Math.max(1,Math.ceil(d/1)):1,_=t.pos.length/3;for(let e=0;e<=g;e++){let r=-.09+(d+.18)*e/g,i=a+f*r,s=o+p*r;if(t.pos.push(i+m,n+Lx(i+m,s+h),s+h,i-m,n+Lx(i-m,s-h),s-h),e){let n=_+(e-1)*2;t.idx.push(n,n+2,n+1,n+1,n+2,n+3)}}}}for(let[t,n]of[[r.road,xx.road],[r.path,xx.path]]){if(!t.idx.length)continue;let r=new Nc;r.setAttribute(`position`,new xc(t.pos,3)),r.setIndex(t.idx),r.computeVertexNormals();let i=Sb.get(n);i||(i=l_(n).clone(),i.polygonOffset=!0,i.polygonOffsetFactor=-2,i.polygonOffsetUnits=n===xx.road?-8:-4,Sb.set(n,i));let a=new W(r,i);a.receiveShadow=!0,e.push(a)}yield;let i=yield*bb();OS()&&(yield),wS++,CS(ny),ny.add(...e),pS=n,i(),_S(),oy&&(oy.shadowMap.needsUpdate=!0),yield;let a=3.4,o=(e,t,n)=>{let r=Math.imul(e|0,374761393)+Math.imul(t|0,668265263)+Math.imul(n,1442695041)|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296},s=[],c={forest:[`round`,`spruce`,`pine`,`birch`,`spruce`],wood:[`spruce`,`pine`,`round`,`birch`,`spruce`],scrub:[`bush`,`bush`,`birch`],park:[`round`,`round`,`birch`,`bush`],cemetery:[`round`,`spruce`,`birch`],green:[`round`,`birch`,`bush`]},l={forest:.55,wood:.55,scrub:.4,park:.28,cemetery:.3,green:.16},u=new Map;for(let e of Q.roads)for(let t=1;t<e.pts.length;t++){let[n,r]=e.pts[t-1],[i,a]=e.pts[t],o=e.width/2+1.1;if(!(Math.max(n,i)<Z.x-100||Math.min(n,i)>Z.x+100||Math.max(r,a)<Z.z-100||Math.min(r,a)>Z.z+100))for(let e=Math.floor((Math.min(n,i)-o)/6);e<=Math.floor((Math.max(n,i)+o)/6);e++)for(let t=Math.floor((Math.min(r,a)-o)/6);t<=Math.floor((Math.max(r,a)+o)/6);t++){let s=lS(e,t),c=u.get(s);c?c.push(n,r,i,a,o):u.set(s,[n,r,i,a,o])}}let d=(e,t)=>{let n=u.get(lS(Math.floor(e/6),Math.floor(t/6)));if(n)for(let r=0;r<n.length;r+=5){let i=n[r],a=n[r+1],o=n[r+2]-i,s=n[r+3]-a,c=o*o+s*s||1,l=Math.max(0,Math.min(1,((e-i)*o+(t-a)*s)/c));if(Math.hypot(i+o*l-e,a+s*l-t)<n[r+4])return!0}return!1},f=Math.floor((Z.x-95)/a),p=Math.floor((Z.x+95)/a),m=Math.floor((Z.z-95)/a),h=Math.floor((Z.z+95)/a);for(let e=m;e<=h;e++)for(let t=f;t<=p;t++){let n=n=>o(t,e,n),r=(t+.15+n(1)*.7)*a,i=(e+.15+n(2)*.7)*a,u=uS(r,i);if(!u||n(3)>(l[u.kind??`green`]??l.green)||Gb(r,i,.9)||d(r,i))continue;let f=c[u.kind??`green`]??c.green;s.push({x:r,z:i,kind:f[Math.floor(n(4)*f.length)],r:n})}TS=s.map(e=>`${e.x.toFixed(2)},${e.z.toFixed(2)},${e.kind}`);let g=(new Date().getUTCMonth()+(Mn(Z,J.origin).lat<0?6:0))%12,_=g<2||g===11?`winter`:g<5?`spring`:g<8?`summer`:`autumn`,v=(e,t)=>{let n=new U(e);return _===`spring`&&n.offsetHSL(.02,.05,.1),_===`autumn`&&n.setHSL(.04+t()*.07,.6,.45),n},y=[{kind:`round`,trunk:[new Gl(.12,.17,1.25,5),7692356,.63],crown:[new dd(1,0),5666381,2.1]},{kind:`spruce`,trunk:[new Gl(.1,.14,.7,5),5915954,.35],crown:[new Kl(.95,2.8,6),3103290,2.05]},{kind:`pine`,trunk:[new Gl(.11,.15,2.2,5),10115892,1.1],crown:[new Gl(1.1,.8,.6,7),5143108,2.45]},{kind:`birch`,trunk:[new Gl(.08,.11,1.5,5),15262938,.75],crown:[new dd(.7,0),9421930,2]},{kind:`bush`,crown:[new dd(.75,0),5999174,.4]}],b=new rs,x=[];for(let e of y){let t=s.filter(t=>t.kind===e.kind);if(!t.length)continue;let n=e.kind===`round`||e.kind===`birch`||e.kind===`bush`,r=_===`winter`&&e.kind!==`bush`&&n,i=e.trunk&&new ml(e.trunk[0],l_(e.trunk[1]),t.length),a=new ml(e.crown[0],l_(16777215),t.length);t.forEach((t,o)=>{let s=5,c=()=>t.r(s++),l=Lx(t.x,t.z),u=.8+c()*.5,d=new No().setFromAxisAngle(new V(0,1,0),c()*Math.PI*2);i&&i.setMatrixAt(o,b.compose(new V(t.x,e.trunk[2]*u+l,t.z),d,new V(u,u,u)));let f=e.kind===`bush`?new V(1.3*u,.7*u,1.3*u):e.kind===`round`?new V(u,(1.3+c()*.5)*u,u):new V(u,u,u);r&&f.multiplyScalar(.35),a.setMatrixAt(o,b.compose(new V(t.x,e.crown[2]*u+l,t.z),d,f)),a.setColorAt(o,r?new U(7035466):n?v(e.crown[1],c):new U(e.crown[1]).offsetHSL(0,0,(c()-.5)*.06))}),a.castShadow=!0,i&&(i.castShadow=!0,x.push(i)),x.push(a)}CS(SS),x.length&&SS.add(...x),oy&&(oy.shadowMap.needsUpdate=!0)}function jS(){for(let e of J.offers)e.readyAt=0}async function MS(e){let t=!1;if(!Y.contains(e)){let n=db(J.origin);await n.load(e),Y=n,Q=n.snapshot(),t=!0}e!==Z&&(Z.weapon=xy,Z.sweepReady=Math.max(0,ky-$),Z.potionReady=Math.max(0,Ay-$)),Z=e,t&&kS(),Sy=J.camps.find(t=>t.id===e.campId)??J.camps[0],X.remove(yy.root),yy.root.traverse(e=>{e instanceof W&&e.geometry.dispose()}),yy=O_(e.role===`archer`?`archer`:`hero`,e.appearance,d_(e)),X.add(yy.root),uw(yy),lw(yy),xy=e.weapon,ky=$+(e.sweepReady??0),Ay=$+(e.potionReady??0),Fy=null,Gw();for(let e of Yy)X.remove(e.node),e.node.geometry.dispose(),e.node.material.dispose();Yy.length=0,rC.length=0,nC().clear(),jy=$+1,Dy=$-10,Fb.set(e.x,0,e.z),yy.root.position.set(e.x,0,e.z),yw(xy),$C(),kC()}function NS(e){X.remove(e.rig.root,e.bar,e.warning),e.rig.root.traverse(e=>{e instanceof W&&e.geometry.dispose()}),e.bar.traverse(e=>{e instanceof W&&(e.geometry.dispose(),e.material.dispose())}),e.warning.geometry.dispose(),e.warning.material.dispose()}var PS=new Ul(1,1,1),FS={},IS=e=>FS[e]??=new kd({color:e}),LS={wood:9133105,ore:9411232,fiber:13226858,herbs:7327610};function RS(e){let t=new H,n=(e,n,r,i,a,o,s)=>{let c=new W(PS,IS(e));c.position.set(n,r+o/2,i),c.scale.set(a,o,s),c.castShadow=!0,t.add(c)};if(e===`wood`)n(9133105,0,0,0,1.5,.45,.45),n(14264426,.76,.02,0,.04,.38,.38),n(7029284,-.3,.45,.05,.6,.3,.35);else if(e===`ore`)n(9411232,0,0,0,.9,.55,.8),n(7569028,.25,.55,-.1,.45,.3,.45),n(13793866,-.2,.4,.38,.22,.18,.08);else if(e===`fiber`)for(let[e,t,r]of[[0,0,.9],[.22,.12,.7],[-.2,.1,.75],[.05,-.2,.8]])n(13226858,e,0,t,.1,r,.1);else n(5217882,0,0,0,.7,.35,.7),n(7327610,.1,.35,-.05,.45,.2,.45),n(15306694,-.15,.45,.2,.14,.14,.14);return t}var zS=new Map,BS=null,VS=null;function HS(e=!1){if(!Y||!Z||!e&&VS===Q&&BS&&u(BS,Z)<10)return;BS={x:Z.x,z:Z.z},VS=Q;let t=e=>Y.contains(e)&&!Gb(e.x,e.z,.75),n=[...wi(J.camps.find(e=>!e.parentId)??J.camps[0],t),...Ci(Q,J.origin,Mn(Z,J.origin),Z,60,t)],r=new Set(n.map(e=>e.key));for(let[t,n]of zS)(!r.has(t)||e)&&(X.remove(n.view),zS.delete(t));let i=Date.now();for(let e of Object.keys(J.harvested??{}))J.harvested[e]<=i&&delete J.harvested[e];for(let e of n){let t=zS.get(e.key);if(t&&u(t.node,e)<.5)continue;t&&X.remove(t.view);let n=RS(e.kind);n.position.set(e.x,0,e.z),n.rotation.y=In(e.key)%628/100,X.add(n),zS.set(e.key,{node:e,view:n})}for(let e of zS.values())e.view.visible=(J.harvested?.[e.node.key]??0)<=i}function US(e){let t=Date.now(),n=!1;for(let{node:r,view:i}of zS.values())i.visible&&e(r)&&(i.visible=!1,J.harvested??={},J.harvested[r.key]=t+di*(Jb(r)?2:1),J.stock[r.kind]+=li[r.kind],xw(r,LS[r.kind],10),bw(`+${li[r.kind]} ${ui[r.kind][0]}`,r,`#ffe5ab`,`xp`),n=!0);return n&&(Bb(330,.08,`square`),Hb()),n}var WS={circles:null,map:null},GS={},KS=0;function qS(e){if(KS+=e,KS<2)return;KS=0;let t=te(J);if(WS.circles!==t||WS.map!==Q){let e=Oi(t,Q,e=>Y.contains(e));e&&(GS=e,WS={circles:t,map:Q})}let n=Mi(J.characters.filter(e=>_r(e.role)).map(e=>({role:e.role,level:Ar(e.exp),trait:e.trait,rarity:e.rarity,at:J.camps.find(t=>t.id===e.campId)??e})),Q),r={...GS};for(let[e,t]of Object.entries(n))r[e]=(r[e]??0)+t;J.rates=r,fr(J,Date.now())&&zb(`Skarbiec pełny — zajrzyj do obozu`)}var JS=!1,YS=0,XS=0,ZS=0,QS=0;function $S(e){let t=Pr(Z);if(e===`charge`){let e={x:Z.x,z:Z.z};for(let e=0;e<50;e++){let e=Z.x+Math.sin(Py)*.1,t=Z.z+Math.cos(Py)*.1;if(Gb(e,t,c.radius))break;Z.x=e,Z.z=t}for(let n of Jy)n.state!==`dead`&&g(e,Z,n.rig.root.position,1.2)&&(Nw(n,SC(Z,22+t,n,!1),Z),Yb(n.rig.root.position,Math.sin(Py+1.4)*1.5,Math.cos(Py+1.4)*1.5));xw(e,14272410,10),Bb(180,.15,`sawtooth`,.04)}else if(e===`quake`){Hy=.25,xw(Z,9136965,18);for(let e of Jy)e.state!==`dead`&&u(e.rig.root.position,Z)<3.5&&(Nw(e,SC(Z,20+t,e,!1),Z),e.state!==`dead`&&(e.state=`recover`,e.timer=Math.max(e.timer,1.2),e.warning.visible=!1));Bb(90,.25,`triangle`,.05)}}function eC(){let e=Ii(Z);if(!(!e||!wy||Ty||Ey||My>$||$<YS)){if(YS=$+Ni[e].cooldown,e===`taunt`){XS=$+4;for(let e of Jy)e.state!==`dead`&&u(e.rig.root.position,Z)<8&&bw(`!`,e.rig.root.position,`#ff6b4a`);xw(Z,16742938,12)}else ZS=40+Pr(Z)*2,QS=$+6,xw(Z,3054591,14);Bb(440,.15,`sine`)}}var tC=null;function nC(){if(!tC){tC=new og(X,(e,t)=>Lx(e,t));for(let e of tC.warmObjects())e.position.y=-1e3,X.add(e)}return tC}var rC=[];function iC(e,t){rC.push({at:$+e,fn:t})}function aC(){for(let e=rC.length-1;e>=0;e--)rC[e].at<=$&&rC.splice(e,1)[0].fn()}var oC=e=>e.state!==`dead`,sC=(e,t)=>Jy.filter(n=>oC(n)&&u(n.rig.root.position,e)<t);function cC(e,t,n){let r,i=t;for(let t of Jy){if(!oC(t)||n?.has(t)||t.hidden)continue;let a=u(t.rig.root.position,e);a<i&&Kb(e,t.rig.root.position)&&(i=a,r=t)}return r}var lC=e=>({x:e.rig.root.position.x,z:e.rig.root.position.z});function uC(e,t,n,r){if(!oC(e))return;let i=(e.burnUntil??0)>$;i||(e.burnNext=$+.5),e.burnDmg=Math.max(i?e.burnDmg??0:0,Math.round(t)),e.burnUntil=$+r,e.burnBy=n}function dC(e,t){oC(e)&&(e.slowUntil=Math.max(e.slowUntil??0,$+t))}function fC(e,t){oC(e)&&(e.state=`recover`,e.timer=Math.max(e.timer,t),e.warning.visible=!1)}function pC(e,t){if(!oC(e))return;let n=(e.frozenUntil??0)>$,r=e.boss?.4:e.elite?.7:1;e.frozenUntil=$+t*r,fC(e,t*r),n||nC().iceBlock(()=>oC(e)&&(e.frozenUntil??0)>$?e.rig.root.position:null,t*r+.2,gw(e))}function mC(e){let t=e.rig.root.position;return(e.burnUntil??0)>$&&(Math.random()<.35&&nC().burst(t,Math.random()<.5?16742954:16760906,1,{up:2.2,gravity:-1.5,speed:.4,size:.12,life:.45,spread:.35}),$>=(e.burnNext??0)&&(e.burnNext=$+.5,Nw(e,e.burnDmg??3,e.burnBy,!0),!oC(e)))||((e.slowUntil??0)>$&&Math.random()<.12&&nC().burst(t,14219007,1,{shape:`shard`,up:.6,gravity:2,speed:.6,size:.08,spread:.4}),(e.frozenUntil??0)>$&&(e.state=`recover`,e.timer=Math.max(e.timer,.1),e.warning.visible=!1,e.bar.position.set(t.x,e.kind===`wolf`?1.8:2.8,t.z),e.bar.quaternion.copy(vy.quaternion),e.fill.scale.x=l(e.hp/e.maxHp,0,1),!0))}var hC=new Map;function gC(e,t){let n=hC.get(e.id);if(!n)return t;if($>n.until||n.amount<=0)return n.fx.end(),hC.delete(e.id),t;let r=Math.min(n.amount,t);return n.amount-=r,r&&bw(`−${r}`,e,`#d8c27a`),n.amount<=0&&(n.fx.end(),hC.delete(e.id),nC().burst(e,10189381,10,{shape:`cube`,additive:!1,speed:3,up:3,gravity:10,size:.1})),t-r}function _C(e,t){return[Z,...wC.map(e=>e.c)].filter(n=>n.hp>0&&u(n,e)<t)}function vC(e,t,n,r){let i=Pr(e),a=Ar(e.exp),o=nC(),s=e=>({x:n.x+Math.sin(r)*e,z:n.z+Math.cos(r)*e});switch(t){case`fireball`:{Lw(s(.65),r,!1,e);let t=Yy[Yy.length-1];return t.damage=26+i,t.explode=2.5,t.trail=16747069,t.node.material.color.set(16756832),t.node.scale.setScalar(1.6),Bb(240,.18,`sawtooth`,.03),!0}case`meteor`:{let t=cC(n,14),r=t?lC(t):s(6);return Bb(160,.5,`sine`,.03),o.meteor(r,.8,()=>{Hy=Math.max(Hy,.32),Bb(70,.35,`sawtooth`,.06),o.ring(r,16738858,.4,3.6,.55),o.ring(r,16765562,.2,2.2,.35),o.burst(r,16742954,22,{speed:6,up:5,size:.15,life:.6}),o.burst(r,4863014,12,{shape:`cube`,additive:!1,speed:5,up:6,gravity:14,size:.16,life:.8}),o.disc(r,16730642,3,2.2,.22);for(let t of sC(r,3))Nw(t,SC(e,34+Math.round(i*1.3),t,!0),e),uC(t,4+i*.25,e,2.5)}),!0}case`blizzard`:{let t=cC(n,13),r=t?lC(t):s(5),a=3.2;o.disc(r,9427199,a,3,.22,.7),o.rain(r,a,`ice`,3),Bb(900,.4,`sine`,.015);for(let t=1;t<=6;t++)iC(t*.5,()=>{for(let t of sC(r,a))Nw(t,SC(e,5+Math.round(i*.35),t,!0),e,!0),dC(t,1.1)});return!0}case`flameCone`:{let t=5.5;o.cone(n,r,t,.55,16742954,.45),Bb(140,.3,`sawtooth`,.04);for(let a of sC(n,t)){let t=a.rig.root.position,o=Math.atan2(t.x-n.x,t.z-n.z)-r;o=Math.atan2(Math.sin(o),Math.cos(o)),!(Math.abs(o)>.7000000000000001||!Kb(n,t))&&(Nw(a,SC(e,18+i,a,!1),e),uC(a,4+i*.2,e,3))}return!0}case`chainLightning`:{let t=new Set,r=[s(.5)],a=cC(n,12),c=22+i;for(a||r.push(s(5));a&&t.size<5;){t.add(a);let n=lC(a);r.push(n),Nw(a,SC(e,Math.round(c),a,!0),e),fC(a,.5),o.burst(n,16773754,6,{speed:3,up:2,size:.07,life:.3}),c*=.82,a=cC(n,4.5,t)}return o.bolt(r,16773754,.35),Bb(1200,.12,`sawtooth`,.035),Uy=Math.max(Uy,$+.04),!0}case`frostNova`:o.ring(n,12578815,.3,4.4,.5),o.disc(n,10478847,4.2,1.2,.2),o.burst(n,14219007,30,{shape:`shard`,speed:7,up:1.2,gravity:2,life:.5,size:.15}),Bb(1400,.25,`triangle`,.02);for(let t of sC(n,4.3))Nw(t,SC(e,14+i,t,!1),e),pC(t,1.6);return!0;case`heal`:return FC(e,_C(n,8)),!0;case`renewal`:{let t={x:n.x,z:n.z};o.disc(t,8188554,4,5.3,.22,.8),o.ring(t,12124095,.5,4,.6),Bb(620,.3,`sine`,.025);for(let n=1;n<=5;n++)iC(n,()=>{o.burst(t,12124095,6,{spread:3.2,up:1.6,gravity:-1.2,speed:.2,life:.9,size:.1}),FC(e,_C(t,4),Math.round(5+a*.9),!0)});return!0}case`petals`:{let t=_C(n,9);o.rain(n,3.6,`petal`,1.6);for(let n of t)FC(e,[n],Math.round((10+a*1.6)*(1+(1-n.hp/Nr(n))*.8)));return!0}case`bark`:{let t=_C(n,9).sort((e,t)=>e.hp/Nr(e)-t.hp/Nr(t))[0];if(!t)return!1;FC(e,[t],Math.round(8+a*1.5)),hC.get(t.id)?.fx.end();let r=25+a*3;return hC.set(t.id,{amount:r,until:$+6,fx:o.bubble(()=>t.hp>0?t:null,11064170,6)}),o.burst(t,9136965,10,{shape:`cube`,additive:!1,speed:1.5,up:2.5,gravity:6,size:.1,spread:.6}),bw(`Kora`,t,`#d8e8a0`,`xp`),!0}default:return!1}}var yC=new Map;function bC(e){let t=yC.get(e.id);return t||yC.set(e.id,t={hits:0,lastHit:-99,saved:!1}),t}var xC=e=>oe[e.rarity??`common`];function SC(e,t,n,r){if(!e?.trait)return t;let i=bC(e),a=xC(e),o=t,s=$-i.lastHit;return e.trait===`firstCrit`&&s>5&&(o*=1+a),e.trait===`hawk`&&s>3&&(o*=2.5),e.trait===`doubleBolt`&&r&&Math.random()<.25*a&&(o*=2),i.lastHit=$,i.hits++,(e.trait===`stun5`&&i.hits%5==0||e.trait===`unbroken`&&i.hits%4==0)&&(n.state=`recover`,n.timer=Math.max(n.timer,.8*a),n.warning.visible=!1,xw(n.rig.root.position,16769658,6)),Math.round(o)}function CC(e,t){if(!e.trait)return t;let n=bC(e),r=xC(e);return $-Dy>8&&(n.saved=!1),e.trait===`evasion`&&Math.random()<.1*r||e.trait===`hawk`&&Math.random()<.2?(bw(`unik`,e,`#bfe9ff`),0):(e.trait===`lastStand`&&e.hp<Nr(e)*.3&&(t*=1-.3*r),e.trait===`lantern`&&(t*=.8),e.trait===`unbroken`&&!n.saved&&t>=e.hp&&(n.saved=!0,t=Math.max(0,e.hp-1)),Math.round(t))}var wC=[],TC=e=>e.role!==`warrior`;function EC(e,t,n){let r=Math.max(1,Math.ceil(Math.hypot(t,n)/.1));for(let i=0;i<r;i++){let i=e.x+t/r,a=e.z+n/r;Gb(i,e.z,.45)||(e.x=i),Gb(e.x,a,.45)||(e.z=a)}}function DC(e){let t=Py+Math.PI+(e?.55:-.55);return ex({x:Z.x+Math.sin(t)*1.8,z:Z.z+Math.cos(t)*1.8})}function OC(e){X.remove(e.rig.root,e.bar),e.rig.root.traverse(e=>{e instanceof W&&e.geometry.dispose()})}function kC(){let e=Ur(J).filter(e=>e!==Z.id);for(let t=wC.length-1;t>=0;t--)e.includes(wC[t].c.id)||(OC(wC[t]),wC.splice(t,1));e.forEach((e,t)=>{if(wC.some(t=>t.c.id===e))return;let n=J.characters.find(t=>t.id===e);u(n,Z)>12&&Object.assign(n,DC(t));let r=O_(n.role===`archer`?`archer`:`hero`,n.appearance,d_(n));r.sword.visible=!TC(n),r.wand.visible=TC(n),r.root.position.set(n.x,0,n.z),X.add(r.root),uw(r);let{group:i,fill:a}=tx(1.3,10211966);X.add(i),wC.push({c:n,rig:r,bar:i,fill:a,cool:0,heading:0,swing:0,stuck:0,spellCool:2+Math.random()*2})}),ty.refreshWorld()}var AC=new URLSearchParams(location.search).has(`qa`);function jC(e,t,n){if(AC||e>=9999)return e;let r=y(e,n);return r||bw(`pudło`,t,`#d9ddd2`),r}var MC=.08;function NC(e,t,n=!1){e.c.hp<=0||Jb(e.c)||(n||(t=jC(t,e.c,MC)),t&&(t=gC(e.c,CC(e.c,Math.max(1,Math.round(t-Fr(e.c)*.45)))),t&&(e.c.hp=Math.max(0,e.c.hp-t),bw(String(t),e.c,`#ff9b8a`),Dy=$,e.c.hp<=0&&zb(`${e.c.name} padł — wstanie po walce`))))}function PC(e){wC.forEach((t,n)=>{let r=t.c,i=t.rig.root.position,a=!1;if(t.cool-=e,t.spellCool-=e,t.swing=Math.max(0,t.swing-e),r.hp<=0){i.y=-.1,t.rig.root.rotation.z=Math.PI*.4;let e=[Z,...wC.map(e=>e.c)].filter(e=>e.role===`herbalist`&&e.hp>0),n=e.some(e=>e.trait===`lifebloom`)?.5:e.some(e=>e.trait===`quickRevive`)?4:8;($-Dy>n||Jb(Z))&&(r.hp=Math.round(Nr(r)*.3),t.rig.root.rotation.z=0,i.y=0)}else{if(u(i,Z)>25){let e=DC(n);i.set(e.x,0,e.z)}if(r.role===`herbalist`&&t.cool<=0){let e=[Z,...wC.map(e=>e.c)].filter(e=>e.hp>0&&e.hp<Nr(e)*.7&&u(e,i)<9).sort((e,t)=>e.hp/Nr(e)-t.hp/Nr(t)),n=ir(r);e.length&&n&&t.spellCool<=0&&vC(r,n,i,t.heading)?(t.spellCool=$n[n].cooldown*1.4,t.cool=1.5,t.swing=.4):e.length&&(FC(r,r.trait===`lifebloom`?e:[e[0]]),t.cool=2.2,t.swing=.3)}let o=Jy.filter(e=>e.state!==`dead`&&u(e.rig.root.position,Z)<10&&Kb(i,e.rig.root.position)).sort((e,t)=>u(e.rig.root.position,i)-u(t.rig.root.position,i))[0];if(o){let n=o.rig.root.position,s=u(i,n);t.heading=Math.atan2(n.x-i.x,n.z-i.z);let l=TC(r)?6:1.5;if(Math.abs(s-l)>.6){let n=s>l?1:-1,r=c.speed*.9*e*n;EC(i,Math.sin(t.heading)*r,Math.cos(t.heading)*r),a=!0}let d=r.role===`mage`?ir(r):null;d&&t.spellCool<=0&&!Jb(i)&&s<11&&vC(r,d,i,t.heading)?(t.spellCool=$n[d].cooldown*1.6,t.cool=1.1,t.swing=.45):t.cool<=0&&!Jb(i)&&(TC(r)?s<11:s<c.reach+.5)&&(t.cool=1.1,t.swing=.3,TC(r)?(Lw({x:i.x+Math.sin(t.heading)*.6,z:i.z+Math.cos(t.heading)*.6},t.heading,!1,r),Yy[Yy.length-1].damage=10+Pr(r),Yy[Yy.length-1].by=r):Nw(o,SC(r,12+Pr(r),o,!1),r))}else{let r=DC(n),o=u(i,r);if(o>.9){t.heading=Math.atan2(r.x-i.x,r.z-i.z);let n=Math.min(o,c.speed*(o>5?1.25:.95)*e),s={x:i.x,z:i.z};EC(i,Math.sin(t.heading)*n,Math.cos(t.heading)*n),a=!0,t.stuck=u(s,i)<n*.3?t.stuck+e:0,(t.stuck>.8&&o>3||o>8&&!Kb(i,Z))&&(i.set(r.x,0,r.z),t.stuck=0)}}r.hp<Nr(r)&&(Jb(r)||$-Dy>c.regenDelay)&&(r.hp=Math.min(Nr(r),r.hp+e*(Jb(r)?22:4)))}r.x=i.x,r.z=i.z,t.rig.root.rotation.y=t.heading,A_(t.rig,e,a,t.swing>0?.5:0,!1),t.bar.visible=r.hp<Nr(r),t.bar.position.set(i.x,2.6,i.z),t.bar.quaternion.copy(vy.quaternion),t.fill.scale.x=l(r.hp/Nr(r),0,1)})}function FC(e,t,n,r=!1){let i=Math.round((n??12+Ar(e.exp)*2)*(e.trait===`bloom`?1+.3*xC(e):1));for(let e of t)e.hp<=0||(e.hp=Math.min(Nr(e),e.hp+i),bw(`+${i}`,e,`#9df29a`),r||nC().pillar(e,10351258,2.6,.5,.7),nC().burst(e,9166938,r?4:9,{shape:`petal`,additive:!1,up:2.4,gravity:-1.2,speed:.9,size:.14,life:.9,spread:.5}));r||Bb(720,.12,`sine`)}function IC(e){if($<XS&&u(Z,e)<12)return{at:Z};let t={at:Z},n=u(Z,e)*(Z.role===`warrior`?.7:1);for(let r of wC){if(r.c.hp<=0)continue;let i=u(r.c,e)*(r.c.role===`warrior`?.7:1);i<n&&(n=i,t={at:r.c,m:r})}return t}function LC(e,t){e.m?NC(e.m,t):Pw(t)}var RC=new Map,zC=new Gc({color:8141549,transparent:!0,opacity:.55,depthWrite:!1}),BC=new Gc({color:1969971,transparent:!0,opacity:.85,depthWrite:!1});function VC(e){let t=e.view;if(t.clear(),e.cubes=[],e.state===`closed`){let e=new W(new Wl(2.6,28),new Gc({color:15327928,transparent:!0,opacity:.35,depthWrite:!1}));e.rotation.x=-Math.PI/2,e.position.y=.03;let n=new W(PS,IS(7029284));n.scale.set(.22,2.4,.22),n.position.y=1.2;let r=new W(PS,IS(14267498));r.scale.set(.38,.2,.38),r.position.y=1.5;let i=new W(PS,new Gc({color:16765562}));i.scale.set(.34,.4,.34),i.position.set(.3,2.2,0),t.add(e,n,r,i);return}let n=new W(new Wl(2.4,24),BC);n.rotation.x=-Math.PI/2,n.position.y=.04,t.add(n);for(let n=0;n<9;n++){let r=new W(PS,n%3?zC:IS(6969930)),i=.2+(e.vent.seed>>>n)%5*.06;r.scale.setScalar(i),r.userData.phase=n/9,t.add(r),e.cubes.push(r)}}var HC=0;function UC(e,t){if(HC+=e,HC>1){HC=0;let e=Q.scale,t=qg(J.origin,Mn(Z,J.origin),Z,80,e,(t,n)=>Y.contains(t)&&Jg(n)<Gg(qr(J,t,e)/e)&&!Gb(t.x,t.z,2.6)),n=new Set(t.map(e=>e.key));for(let e of Object.keys(J.vents??{}))n.add(e);n.add(`qa:vent`);for(let[e,t]of RC)(!n.has(e)||u(t.vent,Z)>110)&&(X.remove(t.view),RC.delete(e));for(let e of t){let t=RC.get(e.key);if(t&&u(t.vent,e)<.5)continue;t&&X.remove(t.view);let n={vent:e,view:new H,state:J.vents?.[e.key]?`closed`:`idle`,cubes:[]};n.view.position.set(e.x,0,e.z),VC(n),X.add(n.view),RC.set(e.key,n)}}for(let e of RC.values()){for(let n of e.cubes){let r=(t*(e.state===`idle`?.25:.5)+n.userData.phase)%1,i=n.userData.phase*Math.PI*2;n.position.set(Math.sin(i)*1.4*(1-r*.5),.2+r*3.2,Math.cos(i)*1.4*(1-r*.5)),n.rotation.set(r*4,r*3,0)}if(e.state===`idle`&&u(e.vent,Z)<9&&!Jb(Z)){e.state=`wave`;let t=Gv(J,e.vent,e.vent.key,Q.scale).tier;for(let n=0;n<Kg(t);n++){let r=n/Kg(t)*Math.PI*2;vw(ex({x:e.vent.x+Math.sin(r)*4,z:e.vent.z+Math.cos(r)*4}),e.vent.seed+n*7,`vent:${e.vent.key}:${n}`)}}if(e.state===`wave`){let t=Jy.filter(t=>t.key.startsWith(`vent:${e.vent.key}:`));!t.length&&u(e.vent,Z)>27?e.state=`idle`:t.length&&t.every(e=>e.state===`dead`)&&(e.state=`ready`)}e.state===`ready`&&e.view.children[0].scale.setScalar(1+Math.sin(t*6)*.08)}}function WC(e){for(let t of RC.values()){if(t.state!==`ready`||!e(t.vent))continue;t.state=`closed`,J.vents??={},J.vents[t.vent.key]=Date.now(),VC(t);let n=Gv(J,t.vent,t.vent.key,Q.scale).tier,r=20+n*10,i=3+Math.floor(n/2);return Z.fragments+=i,Z.potions=Er(Z)+1,J.stock.ore+=2,Ow(t.vent,r,[Vr(J,t.vent.seed%Rr,n+1,Math.random()<.3?`rare`:`common`)]),xw(t.vent,16765562,18),bw(`+${r} tix · +${i} odł. · +1 mikstura`,t.vent,`#ffe5ab`,`xp`),Bb(520,.25,`sine`),Hb(),!0}return!1}var GC=new Map,KC=0;function qC(e){let t=O_(e.seed%2?`archer`:`hero`,e.seed%1e4);t.sword.visible=t.wand.visible=!1,t.root.position.set(e.x,0,e.z),t.root.scale.set(1,.78,1),X.add(t.root),uw(t);let n=new W(PS,new Gc({color:16765562}));n.scale.set(.22,.55,.22),X.add(n),GC.set(e.key,{spot:e,rig:t,mark:n,state:`waiting`})}function JC(e){let t=GC.get(e);t&&(X.remove(t.rig.root,t.mark),t.rig.root.traverse(e=>{e instanceof W&&e.geometry.dispose()}),GC.delete(e))}function YC(e,t){if(KC+=e,KC>1){KC=0;let e=Q.scale,t=qg(J.origin,Mn(Z,J.origin),Z,80,e,(t,n)=>Y.contains(t)&&Jg(n^1540483477)<Xg(qr(J,t,e)/e)&&!Gb(t.x,t.z,1.5),Yg,`w1`).filter(e=>!J.rescued?.[e.key]),n=new Set(t.map(e=>e.key));n.add(`qa:rescue`);for(let[e,t]of GC)(!n.has(e)&&t.state===`waiting`||u(t.spot,Z)>110)&&JC(e);for(let e of t)GC.has(e.key)||qC(e)}for(let e of GC.values()){if(e.mark.position.set(e.spot.x,2.6+Math.sin(t*4)*.15,e.spot.z),e.mark.visible=e.state===`waiting`,e.state===`waiting`&&u(e.spot,Z)<10&&!Jb(Z)){e.state=`wave`;let t=Gv(J,e.spot,e.spot.key,Q.scale).tier,n=Math.max(3,Kg(t)-1);for(let t=0;t<n;t++){let r=t/n*Math.PI*2+.3;vw(ex({x:e.spot.x+Math.sin(r)*3.5,z:e.spot.z+Math.cos(r)*3.5}),e.spot.seed+t*13,`rescue:${e.spot.key}:${t}`)}}if(e.state===`wave`){let t=Jy.filter(t=>t.key.startsWith(`rescue:${e.spot.key}:`));!t.length&&u(e.spot,Z)>30?e.state=`waiting`:t.length&&t.every(e=>e.state===`dead`)&&XC(e)}}}function XC(e){let t=Q.scale,n=qr(J,e.spot,t)/t,r=Mn(e.spot,J.origin),i=e.spot.seed|0,a=()=>((i=Math.imul(i,1664525)+1013904223|0)>>>0)/4294967296,o=[`warrior`,`mage`,`archer`,`herbalist`],s=o[Math.floor(a()*o.length)],c=Zg(n),l=he(a,s,de(r.lat,r.lon),new Set(J.characters.map(e=>e.name)),{rarityLift:c.rarityLift,legendary:a()<c.legendChance}),u=Gv(J,e.spot,e.spot.key,t).tier,d=Kr(J,e.spot,1/0)??J.camps[0],f=ri(J,{id:e.spot.key,...l,role:s,appearance:e.spot.seed%1e4,level:u},e.spot,d.id);J.rescued??={},J.rescued[e.spot.key]=Date.now(),JC(e.spot.key),Ur(J).length<3?(J.party=[...Ur(J),f.id],kC(),zb(`${ge(f)} (${Or(s)}, ${ie[f.rarity??`common`]}) dołącza do drużyny`)):(Object.assign(f,{x:d.x+1.5,z:d.z+1.5}),ty.refreshWorld(),zb(`${ge(f)} czeka na Ciebie w obozie`)),xw(e.spot,16765562,16),Hb()}function ZC(){return[...RC.values()].map(e=>({key:e.vent.key,x:e.vent.x,z:e.vent.z,state:e.state}))}function QC(){return[...zS.values()].map(({node:e,view:t})=>({...e,ready:t.visible}))}function $C(){if(!Y||iy)return;for(let e=Jy.length-1;e>=0;e--)(u(Jy[e].spawn,Z)>85||!/^(vent|rescue|summon):/.test(Jy[e].key)&&!Uv(J,Jy[e].spawn,Jy[e].key,Q.scale))&&(NS(Jy[e]),Jy.splice(e,1));let e=Qn(Mn(Z,J.origin)).map(e=>({...e,p:jn(e.geo,J.origin)})).filter(e=>u(e.p,Z)<70).sort((e,t)=>u(e.p,Z)-u(t.p,Z));for(let{key:t,seed:n,p:r}of e){if(Jy.length>=(cy?22:32))break;Jy.some(e=>e.key===t)||n%4==0||(J.encounters[t]??0)>Date.now()||Gb(r.x,r.z,1.2)||!Uv(J,r,t,Q.scale)||wy&&tS(r)||vw(r,n,t)}}var ew=!1,tw=e=>new Promise(t=>setTimeout(t,e));async function nw(e){let t=Date.now()+e;for(await tw(120);Date.now()<t&&(Y.loading||Fx||zx!==1/0||Hx||Ix>50);)await tw(60)}function rw(e,t,n=!1){let r=q(`travel-veil`);e&&(q(`travel-veil-text`).textContent=e),r.classList.toggle(`light`,n),t?(r.hidden=!1,requestAnimationFrame(()=>r.classList.add(`on`))):(r.classList.remove(`on`),setTimeout(()=>{r.classList.contains(`on`)||(r.hidden=!0)},320))}async function iw(e,t){if(ew)return;ew=!0,rw(`Podróż liną…`,!0),Bb(520,.2,`sine`,.04),await tw(380);let n={x:Z.x,z:Z.z,campId:Z.campId,coins:Z.coins};try{Z.coins-=t,Z.x=e.x+1.6,Z.z=e.z+1.6,Z.campId=e.id,Y.pin(e),await MS(Z),Y.pin(e);let n=ex(Z);Z.x=n.x,Z.z=n.z;for(let[e,t]of wC.entries())Object.assign(t.c,DC(e)),t.rig.root.position.set(t.c.x,Lx(t.c.x,t.c.z),t.c.z);Fb.set(Z.x,0,Z.z),iS(),Bx(0),Hb(),await nw(2600),zb(`Drużyna dotarła do obozu · −${t} tix`)}catch{Object.assign(Z,n),zb(`Mapa przy tym obozie jest niedostępna`)}finally{rw(``,!1),ew=!1}}function aw(e){Y.pin(e),iS(),rw(`Rozstawiam obóz…`,!0,!0),Bb(300,.25,`triangle`,.04),nw(2400).then(()=>rw(``,!1))}async function ow(e){let t=db(e);await t.load({x:0,z:0});let n=t.snapshot(),r=Zn(n,e=>t.contains(e,4.6)),i=J.origin;ty.reproject(t=>jn(Mn(t,i),e)),J.origin=e,Y=t,Y.pin({x:0,z:0}),Q=n;for(let e of Jy)NS(e);Jy.length=0,kS(),Z.x=r.x,Z.z=r.z;let a={...r,id:`camp-${++J.serial}`,route:[],buildings:0};J.camps.push(a),Z.campId=a.id,Sy=a,await MS(Z),ty.countBuildings(),ty.refreshWorld(),Hb()}function sw(e){if(ry+=e,!(ry<.5)){if(ry=0,Math.hypot(Z.x,Z.z)>1500&&!ty.rope){let e=J.origin,t=Mn(Z,e);ty.reproject(n=>jn(Mn(n,e),t)),J.origin=t,Y.rebase(t);for(let e of Jy)NS(e);Jy.length=0,Sy=J.camps.find(e=>e.id===Z.campId),Fb.set(Z.x,0,Z.z),HS(!0),Hb()}!ey&&Y.tiles.size===0&&Math.abs(Z.x)<55&&Math.abs(Z.z)<55?($C(),qS(.5)):(Y.request(Z),Y.changed&&(Y.pending()===0||!Y.contains(Z,25))&&(Q=Y.snapshot(),lb(Q.buildings),Y.contains(Z,25)||(Xx=!1),Bx()),$C(),HS(),qS(.5))}}var cw=new Gc({color:13214826,depthWrite:!1,depthFunc:6});function lw(e){let t=[];e.root.traverse(e=>{e instanceof W&&!(e.material instanceof zc&&e.material.transparent)&&t.push(e)});for(let e of t){e.renderOrder=2;let t=new W(e.geometry,cw);t.renderOrder=1,t.userData.xray=!0,e.add(t)}}function uw(e){e.root.traverse(e=>{e instanceof W&&(e.castShadow=!1)});let t=new W(new Wl(.65,16),new Gc({color:2111532,transparent:!0,opacity:.22,depthWrite:!1}));t.rotation.x=-Math.PI/2,t.position.y=.045,e.root.add(t)}var dw=`day`,fw=`clear`,pw={pack:`wolf`,charge:`raider`,shooter:`archer`,caster:`mage`,ambush:`raider`,summoner:`mage`,colossus:`heavy`,thief:`raider`,lure:`wolf`,whirl:`heavy`},mw={weak:32,medium:48,elite:120,boss:320};function hw(e){let t=e.boss?`boss`:e.elite?`elite`:e.species.rank;return mw[t]*(t===`medium`&&e.species.behavior===`summoner`?.6:1)*(1+(e.tier-1)*.35)}function gw(e){return e.species.size*(e.boss?1.5:e.elite&&e.species.rank!==`elite`?1.2:1)}function _w(e,t){let n=new U(t);e.root.traverse(e=>{(e instanceof W&&e.material instanceof kd||e instanceof W&&e.material instanceof Od)&&(e.material=e.material.clone(),e.material.color.lerp(n,.55))})}function vw(e,t,n=`legacy-${t}`,r){let{elite:i,boss:a,tier:o,frontierMeters:s}=Gv(J,e,n,Q.scale),c=In(`${n}:species`)%1e3/1e3,l=r??Ug(Hg(Q,e),a?`boss`:i?`elite`:c<.6?`weak`:`medium`,dw,fw,s>800,In(`${n}:pick`)%1e3/1e3),u=l.behavior,d=pw[u],f=l.look===`wolf`?k_():O_(l.look===`archer`?`archer`:`hero`,t%1e4);l.look!==`wolf`&&(f.sword.visible=d===`raider`||d===`heavy`,f.wand.visible=!f.sword.visible),_w(f,l.color),f.root.position.set(e.x,0,e.z),f.root.scale.setScalar(gw({boss:a,elite:i,species:l})),X.add(f.root),uw(f);let{group:p,fill:m}=tx(a?3.2:i?2.3:1.7,a?15038837:i?15907944:14262910);X.add(p);let h=u===`charge`?j_(6.5,.14,15100995,.4):u===`colossus`?j_(3.2,Math.PI,15100995,.35):u===`whirl`?j_(2.7,Math.PI,15100995,.35):d===`wolf`||d===`raider`||d===`heavy`?j_(i?5:3.5,.38,15100995,.4):j_(11,.08,15100995,.3);h.position.y=.07,h.visible=!1,X.add(h);let g={id:t,key:n,tier:o,boss:a,rig:f,spawn:{...e},wanderTarget:null,wanderWait:Math.random()*2,hp:0,maxHp:0,kind:d,species:l,behavior:u,hidden:u===`ambush`,summonT:3,stolen:0,fleeUntil:0,elite:i||l.rank===`elite`,state:`idle`,timer:0,heading:0,hit:!1,flash:0,bar:p,fill:m,warning:h,respawn:0};return g.hp=g.maxHp=hw(g),g.hidden&&(f.root.visible=!1),Jy.push(g),g}function yw(e){xy=e,yy.sword.visible=e===`sword`,yy.wand.visible=e===`magic`,q(`attack-symbol`).innerHTML=qv(e),Hb()}function bw(e,t,n=`#fff1c8`,r=`damage`){let i=document.createElement(`span`);i.className=r===`xp`?`float-label float-xp`:`float-label`,i.textContent=e,i.style.color=n,document.body.append(i);let a=r===`damage`?(Math.random()-.5)*.9:0,o=r===`xp`?1.3:.8;Zy.push({el:i,p:new V(t.x+a,r===`xp`?3.5:2.4,t.z),life:o,total:o})}function xw(e,t,n=8){for(let r=0;r<n;r++){let n=new W(new Ul(.09,.09,.22),new Gc({color:t}));n.position.set(e.x,1,e.z),X.add(n);let r=Math.random()*Math.PI*2;Xy.push({node:n,velocity:new V(Math.sin(r)*(1+Math.random()*3),2+Math.random()*3,Math.cos(r)*(1+Math.random()*3)),life:.35+Math.random()*.2,total:.55})}}var Sw=[],Cw={common:10132122,rare:4165600,epic:13073919,legendary:15250746},ww=e=>e.rarity===`uncommon`?`rare`:e.rarity??`common`,Tw=0;function Ew(e){let t=new H,n=new H;if(t.add(n),!e){let e=new W(new Gl(.16,.16,.05,10),new kd({color:15779154,emissive:5913608}));return e.rotation.x=Math.PI/2.4,n.add(e),t}let r=ww(e),i=new U(Cw[r]),a=new kd({color:e.slot===`material`?e.icon===`fang`?15853778:10120005:13159624,emissive:i.clone().multiplyScalar(r===`common`?0:.35)}),o=new W(e.slot===`material`?new dd(.22,0):e.slot===`weapon`?new Ul(.12,.9,.08):new Ul(.5,.42,.24),a);if(e.slot===`weapon`&&(o.rotation.z=.5),n.add(o),r!==`common`){let e=new W(new md(.55,.95,28),new Gc({color:i,transparent:!0,opacity:.45,depthWrite:!1,side:2}));e.rotation.x=-Math.PI/2,e.userData.ground=!0,t.add(e)}if(r===`epic`||r===`legendary`){let e=r===`legendary`?7:4,n=new W(new Gl(.22,.32,e,12,1,!0),new Gc({color:i,transparent:!0,opacity:.32,depthWrite:!1,blending:2,side:2}));n.position.y=e/2,n.userData.ground=!0,t.add(n)}return t}function Dw(e,t,n){let r=Math.random()*Math.PI*2,i=n?1.2+Math.random()*1.2:1.5+Math.random()*2,a=Ew(n);X.add(a);let o={node:a,x:e.x,z:e.z,y:Lx(e.x,e.z)+.9,vx:Math.sin(r)*i,vz:Math.cos(r)*i,vy:n?6:5,bounced:!1,landed:!1,t:0,slow:1,coin:t,item:n};if(n){let e=ww(n);if(e===`legendary`?(o.slow=.35,Bb(523,.35,`sine`,.05),Bb(784,.5,`sine`,.04)):e===`epic`&&Bb(660,.2,`sine`,.04),e!==`common`){let t=new Float32Array(30);o.sparks=new Ll(new Nc().setAttribute(`position`,new vc(t,3)),new Ml({color:Cw[e],size:4,sizeAttenuation:!1,transparent:!0,opacity:.9})),o.sparks.frustumCulled=!1,a.add(o.sparks)}}Sw.push(o)}function Ow(e,t,n){for(let n of s(t))Dw(e,n);for(let t of n)Dw(e,void 0,t)}function kw(e){X.remove(e.node),e.node.traverse(e=>{(e instanceof W||e instanceof Ll)&&(e.geometry.dispose(),e.material.dispose())}),Sw.splice(Sw.indexOf(e),1)}function Aw(){let e=q(`loot`).getBoundingClientRect(),t=new V(Z.x,Lx(Z.x,Z.z)+1.4,Z.z).project(vy),n=document.createElement(`i`);n.className=`fly-coin`,n.style.left=`${(t.x+1)/2*innerWidth}px`,n.style.top=`${(1-t.y)/2*innerHeight}px`,document.body.append(n),requestAnimationFrame(()=>{n.style.left=`${e.left+18}px`,n.style.top=`${e.top+e.height/2}px`,n.style.opacity=`0.2`}),setTimeout(()=>{n.remove();let e=q(`loot`);e.classList.remove(`pulse`),e.offsetWidth,e.classList.add(`pulse`)},450)}function jw(e){if(e.coin)Z.coins+=e.coin,Aw(),Bb(980,.04,`sine`,.02);else if(e.item){if(!xr(Z.bag,e.item,or.slots))return $-Tw>6&&zb(`Plecak pełny`),Tw=$,!1;let t=ww(e.item),n=Cw[t];xw(Z,n,t===`common`?4:14),bw(`+ ${e.item.name}`,Z,`#${n.toString(16).padStart(6,`0`)}`,`xp`),Bb(t===`common`?700:880,.12,`sine`,.03)}return kw(e),Hb(),!0}function Mw(e){for(let t of[...Sw]){let n=e*t.slow,r=Lx(t.x,t.z)+.12;t.landed?t.t+=e:(t.vy-=18*n,t.x+=t.vx*n,t.z+=t.vz*n,t.y+=t.vy*n,t.y<=r&&(t.y=r,t.bounced?(t.landed=!0,t.t=0):(t.bounced=!0,t.vy=Math.abs(t.vy)*.35,t.vx*=.45,t.vz*=.45,t.slow=1)));let i=t.coin!==void 0||t.item&&!o(ww(t.item));if(t.landed&&i&&t.t>.4){let n=Z.x-t.x,r=Z.z-t.z,i=Math.hypot(n,r),a=Math.min(i,(8+t.t*18)*e);if(i<.6){if(jw(t))continue}else t.x+=n/i*a,t.z+=r/i*a,t.y=Lx(t.x,t.z)+.6+Math.min(1,i)*.4}else if(t.landed&&t.item&&o(ww(t.item))&&u(Z,t)<1.3&&jw(t))continue;t.node.position.set(t.x,t.landed&&!i?Lx(t.x,t.z):t.y,t.z);let a=t.node.children[0];if(t.landed&&!i?a.position.y=.45+Math.sin($*2+t.x)*.06:a.position.y=0,a.rotation.y+=e*(t.coin?6:1.5),t.sparks){let e=t.sparks.geometry.getAttribute(`position`);for(let t=0;t<10;t++){let n=$*1.3+t*.63,r=($*.8+t*.37)%1.6;e.setXYZ(t,Math.sin(n)*.7,r,Math.cos(n)*.7)}e.needsUpdate=!0}}}function Nw(e,t,n,i=!1){if(e.state!==`dead`){if(i||(t=jC(t,e.rig.root.position)),!t)Bb(420,.04,`triangle`,.02);else if(e.hp-=t,e.flash=.13,xw(e.rig.root.position,e.elite?16765552:15983275),bw(String(t),e.rig.root.position),Hy=Math.max(Hy,.07),Bb(210,.06,`triangle`),e.hp<=0){if(e.hp=0,e.state=`dead`,e.timer=0,e.warning.visible=!1,e.bar.visible=!1,e.respawn=/^(vent|rescue|summon):/.test(e.key)?1/0:Xb,e.stolen&&=(Z.coins+=e.stolen,bw(`+${e.stolen} tix`,e.rig.root.position,`#ffd27a`,`xp`),0),n?.trait===`volatile`){xw(e.rig.root.position,10475775,12);for(let t of Jy)t!==e&&t.state!==`dead`&&u(t.rig.root.position,e.rig.root.position)<2.5&&Nw(t,Math.round(10*xC(n)))}Z.kills++;let t=Math.max(1,Math.round((e.boss?80:e.elite?24:8)*(1+(e.tier-1)*.3)/(1+Math.max(0,Ar(Z.exp)-e.tier-2)*.6)));Z.exp+=t;for(let n of wC)n.c.hp>0&&u(n.c,e.rig.root.position)<15&&(n.c.exp+=t);J.encounters[e.key]=Date.now()+Zb;let i=e.boss?`boss`:e.elite?`elite`:e.species.rank,a=r(e.species.look,i,e.tier,Math.random);Ow(e.rig.root.position,a.tix,[...a.materials.map(t=>Br(J,t,e.tier)),...a.gear.map((t,n)=>Vr(J,e.id+n*3,e.tier,t))]),Z.fragments+=e.elite?5:1,Bb(640,.13,`sine`),bw(`+${t} XP`,e.rig.root.position,`#e6f3be`,`xp`),Hb()}}}function Pw(e,t=!1){if(!($<jy||$<My||Jb(Z))){if(t||(e=jC(e,Z,MC)),!e)jy=$+.35;else{if(e=CC(Z,Math.max(1,Math.round(e-Fr(Z)*.45))),$<XS&&(e=Math.round(e*.7)),$<QS&&ZS>0){let t=Math.min(ZS,e);ZS-=t,e-=t,t&&bw(`−${t}`,Z,`#8fc8ff`)}e=gC(Z,e),e&&(Z.hp=Math.max(0,Z.hp-e),jy=$+.35,Dy=$,Hy=.2,Uy=$+.22,bw(`−`+e,Z,`#ffbfa4`),Bb(95,.11,`sawtooth`,.04),Z.hp<=0&&(My=$+1.1,Z.exp=Mr(Z.exp),ty?.cancelRope(),Z.coins=0,Fy=null,Gw(),zb(`Pokonano Cię. Wracasz do schronienia — sprzęt i odkrycia zostają.`)))}}}function Fw(e){return Jy.filter(t=>t.state!==`dead`&&u(Z,t.rig.root.position)<e&&Kb(Z,t.rig.root.position)).sort((e,t)=>u(Z,e.rig.root.position)-u(Z,t.rig.root.position))[0]}function Iw(e=!1,t=!1){if(!wy||Ty||Ey||Xw||ly||uy||My>$||Fy||(e?$<ky:$-Oy<c.attackCooldown))return;let n=Jb(Z);if(n&&e){Ly();return}if(n&&Fw(xy===`magic`?16:5)&&Ly(),t&&!n){let e=Fw(xy===`magic`?16:5);e&&(Py=Math.atan2(e.rig.root.position.x-Z.x,e.rig.root.position.z-Z.z))}let r=e?Pi(Z):null;if(e&&(ky=$+Ni[r].cooldown),r&&r in $n)vC(Z,r,Z,Py),yy.wand.visible=!0,Oy=$,$n[r].element!==`life`&&(Dy=$);else if(r===`volley`){for(let e=-2;e<=2;e++)Lw({x:Z.x+Math.sin(Py)*.65,z:Z.z+Math.cos(Py)*.65},Py+e*.17,!1);Bb(420,.12,`triangle`,.03),Oy=$,Dy=$}else r===`charge`||r===`quake`?($S(r),Oy=$,Dy=$):(JS=r===`whirl`,Fy={t:0,duration:e?.58:c.attackDuration,hit:!1,sweep:e,heading:Py,ranged:xy===`magic`&&!e&&!n,calm:n},Oy=$,n||(Dy=$),yy.sword.visible=xy===`sword`||e,yy.wand.visible=xy===`magic`&&!e,Bb(e?330:260,.09,`triangle`,.03))}function Lw(e,t,n,r=Z){let i=n?null:ar(r),a=n?15369306:i?nr[i]:8908270,o=new W(new dd(n?.14:.23,1),new Gc({color:a}));o.position.set(e.x,1.1+Lx(e.x,e.z),e.z),X.add(o);let s=n?10:23;Yy.push({node:o,fromEnemy:n,vx:Math.sin(t)*s,vz:Math.cos(t)*s,life:n?2.2:1.1,damage:n?13:18+Pr(r),by:n?void 0:r,trail:n?void 0:a})}function Rw(){!wy||Ty||Ey||My>$||$<Ay||Z.hp>=by()||(Er(Z)<=0?zb(`Brak mikstur — kup je w obozie (Sklep)`):(Z.potions=Er(Z)-1,Ay=$+c.potionCooldown,Z.hp=Math.min(by(),Z.hp+38),bw(`+38`,Z,`#c8eea4`),xw(Z,12379810),Bb(540,.18,`sine`),Hb()))}function zw(e){for(let t of Jy){let n=e;if(t.flash=Math.max(0,t.flash-n),t.state===`dead`){if(t.timer+=n,t.rig.root.rotation.z=Math.min(1,t.timer*5)*Math.PI*.45,t.rig.root.scale.setScalar(gw(t)*Math.max(0,1-Math.max(0,t.timer-.6)*2)),t.respawn-=n,t.respawn<=0&&u(Z,t.spawn)>10&&!Jb(t.spawn)&&!tS(t.spawn)){let e=Gv(J,t.spawn,t.key,Q.scale);t.tier=e.tier,t.boss=e.boss,t.elite=e.elite,t.maxHp=hw(t),t.state=`idle`,t.hp=t.maxHp,t.timer=0,t.rig.root.position.set(t.spawn.x,0,t.spawn.z),t.rig.root.rotation.z=0,t.rig.root.scale.setScalar(gw(t)),t.hidden=t.behavior===`ambush`,t.rig.root.visible=!t.hidden,t.stolen=0,t.slowUntil=t.frozenUntil=t.burnUntil=0}continue}if(mC(t))continue;(t.slowUntil??0)>$&&(n*=.45);let r=t.rig.root.position,i=IC(r),a=i.at,o=u(a,r),s=!1;if(t.timer-=n,t.hidden){if(t.rig.root.visible=!1,t.bar.visible=!1,o<4&&!Jb(a))t.hidden=!1,t.rig.root.visible=!0,xw(r,t.species.color,12),t.state=`windup`,t.timer=.35,t.heading=Math.atan2(a.x-r.x,a.z-r.z),t.hit=!1;else continue}if(t.behavior===`lure`&&o<1.6&&!Jb(a)){xw(r,t.species.color,18);for(let e of[{at:Z},...wC.filter(e=>e.c.hp>0).map(e=>({at:e.c,m:e}))])u(e.at,r)<2.6&&LC(e,Math.round(14*(1+(t.tier-1)*.22)));Nw(t,99999)}else{if(t.behavior===`summoner`&&o<12&&!Jb(a)){t.summonT-=n;let e=Jy.filter(e=>e.key.startsWith(`summon:${t.key}:`)&&e.state!==`dead`);if(t.summonT<=0&&e.length<4){t.summonT=6;let n=Bg(zg[t.species.biome===`any`?Hg(Q,t.spawn):t.species.biome]);for(let i=0;i<2;i++)vw(ex({x:r.x+Math.sin(t.heading+1.5+i*3)*1.6,z:r.z+Math.cos(t.heading+1.5+i*3)*1.6}),t.id+7919*(e.length+i+1),`summon:${t.key}:${Date.now()%1e5}:${i}`,n);xw(r,8141549,12)}}if(t.behavior===`thief`&&$<t.fleeUntil){let e=Math.atan2(r.x-a.x,r.z-a.z);t.heading=e,Yb(r,Math.sin(e)*4.2*n,Math.cos(e)*4.2*n),t.state=`idle`,t.warning.visible=!1,t.rig.root.rotation.y=t.heading,A_(t.rig,n,!0,0,!1),t.bar.visible=o<20,t.bar.position.set(r.x,t.kind===`wolf`?1.8:2.8,r.z),t.bar.quaternion.copy(vy.quaternion),t.fill.scale.x=l(t.hp/t.maxHp,0,1)}else{if((Jb(a)||Jb(r))&&(t.state=`idle`,t.timer=0,t.hit=!1),t.state===`idle`){if(u(r,t.spawn)>20||Jb(a)||Jb(r)||o>17)s=$b(t,n),o>20&&(t.hp=Math.min(t.maxHp,t.hp+n*6));else if(o<(t.behavior===`charge`?6:t.behavior===`colossus`||t.behavior===`whirl`?2.8:t.kind===`wolf`||t.kind===`raider`||t.kind===`heavy`?3.6:10)&&Kb(r,a))t.wanderTarget=null,t.state=`windup`,t.timer=t.behavior===`colossus`?1.3:t.behavior===`charge`?.8:t.kind===`heavy`?1.1:t.kind===`wolf`||t.kind===`raider`?.65:.85,t.heading=Math.atan2(a.x-r.x,a.z-r.z),t.hit=!1;else{let e=Math.atan2(a.x-r.x,a.z-r.z);t.heading=e,t.behavior===`pack`&&o>3&&(e+=t.id%2?.6:-.6),t.behavior===`summoner`&&o<7&&(e+=Math.PI);let i=t.kind===`archer`&&o<5?-1:1;Yb(r,Math.sin(e)*(t.kind===`heavy`?1.7:t.kind===`wolf`?3.1:2.5)*n*i,Math.cos(e)*(t.kind===`heavy`?1.7:t.kind===`wolf`?3.1:2.5)*n*i),s=!0}}else if(t.state===`windup`&&t.timer<=0){if(t.state=`strike`,t.timer=t.behavior===`charge`?.45:t.kind===`wolf`||t.kind===`raider`||t.kind===`heavy`?.32:.12,t.behavior===`colossus`||t.behavior===`whirl`){let e=t.behavior===`colossus`?3.2:2.7;Hy=Math.max(Hy,t.behavior===`colossus`?.2:.08),xw(r,t.species.color,14);for(let n of[{at:Z},...wC.filter(e=>e.c.hp>0).map(e=>({at:e.c,m:e}))])u(n.at,r)<e&&LC(n,Math.round((t.boss?38:t.elite?28:22)*(1+(t.tier-1)*.22)));t.hit=!0}(t.kind===`archer`||t.kind===`mage`)&&(Lw(r,t.heading,!0),Yy[Yy.length-1].damage=Math.round((t.kind===`mage`?17:13)*(t.boss?1.6:t.elite?1.15:1)*(1+(t.tier-1)*.22)))}else if(t.state===`strike`){if((t.kind===`wolf`||t.kind===`raider`||t.kind===`heavy`)&&t.behavior!==`colossus`&&t.behavior!==`whirl`){let e={x:r.x,z:r.z},o=t.behavior===`charge`?14:10;if(Yb(r,Math.sin(t.heading)*o*n,Math.cos(t.heading)*o*n),!t.hit&&g(e,r,a,.95)&&(LC(i,Math.round((t.boss?38:t.elite?25:t.kind===`heavy`?24:15)*(1+(t.tier-1)*.22))),t.hit=!0,t.behavior===`thief`&&!i.m&&Z.coins>0)){let e=Math.min(Z.coins,Math.max(5,Math.round(Z.coins*.1)));Z.coins-=e,t.stolen+=e,t.fleeUntil=$+7,bw(`−${e} tix`,Z,`#ffd27a`)}}t.timer<=0&&(t.state=`recover`,t.timer=t.elite?.65:1)}else t.state===`recover`&&t.timer<=0&&(t.state=`idle`);t.rig.root.rotation.y=t.heading,t.warning.visible=t.state===`windup`,t.warning.position.set(r.x,.065,r.z),t.warning.rotation.z=t.heading,t.warning.rotation.set(-Math.PI/2,0,t.heading),A_(t.rig,n,s,t.state===`strike`?.5:0,!1),t.flash>0&&(t.rig.body.position.y+=.12),t.bar.visible=o<20,t.bar.position.set(r.x,t.kind===`wolf`?1.8:2.8,r.z),t.bar.quaternion.copy(vy.quaternion),t.fill.scale.x=l(t.hp/t.maxHp,0,1)}}}}function Bw(e){if(Fy){if(Fy.t+=e,Py=Fy.heading,!Fy.hit&&Fy.t>=c.attackHitAt){if(Fy.hit=!0,Fy.ranged)Lw({x:Z.x+Math.sin(Py)*.65,z:Z.z+Math.cos(Py)*.65},Py,!1);else{let e=!1;for(let t of Jy)!Fy.calm&&t.state!==`dead`&&f(Z,t.rig.root.position,Py,Fy.sweep?c.sweepReach:c.reach,Fy.sweep?JS?Math.PI:c.sweepHalfArc:c.halfArc)&&Kb(Z,t.rig.root.position)&&(Nw(t,SC(Z,(Fy.sweep?24:16)+Pr(Z),t,!1),Z),e=!0);let t=Fy;!t.calm&&WC(e=>f(Z,e,Py,t.sweep?c.sweepReach:c.reach,t.sweep?c.sweepHalfArc:c.halfArc,2.2))&&(e=!0),US(e=>f(Z,e,Py,t.sweep?c.sweepReach:c.reach,t.sweep?c.sweepHalfArc:c.halfArc,.6)&&Kb(Z,e))&&(e=!0),e&&Fy.sweep&&(Hy=.16,Bb(130,.15,`triangle`))}}Fy.t>=Fy.duration&&(Fy=null,yy.sword.visible=xy===`sword`,yy.wand.visible=xy===`magic`)}}function Vw(e){for(let t=Yy.length-1;t>=0;t--){let n=Yy[t],r=n.node.position,i={x:r.x,z:r.z};r.x+=n.vx*e,r.z+=n.vz*e,n.life-=e,n.trail!==void 0&&nC().burst({x:r.x,y:r.y,z:r.z},n.trail,n.explode?2:1,{speed:.3,up:.3,gravity:0,life:.25,size:n.explode?.16:.09});let a=!1;if(Kb(i,r)||(a=!0),!a&&n.fromEnemy&&g(i,r,Z,.6)&&(Pw(n.damage),a=!0),!a&&n.fromEnemy){for(let e of wC)if(e.c.hp>0&&g(i,r,e.c,.6)){NC(e,n.damage),a=!0;break}}if(!a&&!n.fromEnemy&&(a=US(e=>g(i,r,e,.7))),!a&&!n.fromEnemy){for(let e of Jy)if(e.state!==`dead`&&g(i,r,e.rig.root.position,.7)){Nw(e,SC(n.by,n.damage,e,!0),n.by),a=!0;break}}if(a&&n.explode){nC().ring(r,16747069,.3,n.explode+.4,.4),nC().burst({x:r.x,y:r.y,z:r.z},16747069,18,{speed:5,up:3,size:.14}),Hy=Math.max(Hy,.12);for(let e of Jy)e.state!==`dead`&&u(e.rig.root.position,r)<n.explode&&Nw(e,Math.round(n.damage*.6),n.by)}(a||n.life<=0)&&(xw(r,n.fromEnemy?15047275:10807524,4),X.remove(n.node),n.node.geometry.dispose(),n.node.material.dispose(),Yy.splice(t,1))}}function Hw(e){for(let t=Xy.length-1;t>=0;t--){let n=Xy[t];n.life-=e,n.velocity.y-=12*e,n.node.position.addScaledVector(n.velocity,e),n.node.rotation.x+=e*10,n.node.scale.setScalar(Math.max(0,n.life/n.total)),n.life<=0&&(X.remove(n.node),n.node.geometry.dispose(),n.node.material.dispose(),Xy.splice(t,1))}let t=[];for(let n=0;n<Zy.length;n++){let r=Zy[n];r.life-=e,r.p.y+=e*(r.total>1?.9:1.6);let i=r.p.clone().project(vy),a=(i.x+1)*innerWidth/2,o=(1-i.y)*innerHeight/2;for(let e=0;e<t.length;e++)Math.abs(t[e].x-a)<46&&Math.abs(t[e].y-o)<22&&(o=t[e].y-22,e=-1);t.push({x:a,y:o}),r.el.style.left=`${a}px`,r.el.style.top=`${o}px`,r.el.style.opacity=String(Math.min(1,r.life*3))}for(let e=Zy.length-1;e>=0;e--)Zy[e].life<=0&&(Zy[e].el.remove(),Zy.splice(e,1))}var Uw=-1e9;function Ww(){let e=l(Z.hp/by(),0,1);q(`hp-fill`).style.width=`${e*100}%`,document.querySelector(`.health`)?.setAttribute(`aria-valuenow`,String(Math.round(e*100)));let t=jr(Z.exp);document.querySelector(`.avatar`)?.style.setProperty(`--xp`,`${t*360}deg`),document.querySelector(`.xp`)?.setAttribute(`aria-valuenow`,String(Math.round(t*100))),document.querySelector(`.vitals`)?.classList.toggle(`low-health`,e<.3),q(`hp-label`).textContent=`${Math.ceil(Z.hp)} / ${by()}`,q(`level`).textContent=String(Ar(Z.exp));let n=document.querySelector(`.hero-name`)?.firstChild;n&&(n.textContent=`${ge(Z)} `),document.querySelector(`.vitals`)?.style.setProperty(`--rarity`,ae[Z.rarity??`common`]),q(`xp-fill`).style.width=`${t*100}%`;let r=Jb(Z),i=$-Dy<c.regenDelay;q(`zone`).className=`zone ${r?`safe`:i?`combat`:`danger`}`,q(`zone`).textContent=r?`Strefa bezpieczna`:i?`Walka`:`Dzicz`,q(`attack-stick`).classList.toggle(`calm`,r);let a=ty?.ropeUsed()??0,o=a?`${Math.max(0,J.stock.rope-a)} m liny (rozwinięte ${a} m)`:`${J.stock.rope} m liny`,s=`${Z.coins} tix · ${Z.fragments} odł. · ${J.stock.wood} drewna · ${o}`;q(`loot`).textContent!==s&&(q(`loot`).textContent=s);let u=Math.max(0,ky-$),d=Math.max(0,Ay-$);q(`sweep`).disabled=u>0||Ty||Ey;let f=Fi(Z);f!==xy&&!Fy&&yw(f);let p=Pi(Z),m=Ni[p].name.toUpperCase();q(`sweep-name`).textContent!==m&&(q(`sweep-name`).textContent=m,q(`sweep-icon`).innerHTML=qv(p),q(`sweep`).setAttribute(`aria-label`,`${Ni[p].name}: ${Ni[p].text}`));let h=Ii(Z),g=q(`skill2`);if(g.hidden!==!h&&(Uw=0),g.hidden=!h,h){let e=Math.max(0,YS-$);g.disabled=e>0||Ty||Ey,q(`skill2-name`).textContent!==Ni[h].name.toUpperCase()&&(q(`skill2-name`).textContent=Ni[h].name.toUpperCase(),q(`skill2-icon`).innerHTML=qv(h)),q(`skill2-time`).textContent=e?`${e.toFixed(1)} s`:`GOTOWY`,g.style.setProperty(`--cd`,(e/Ni[h].cooldown).toFixed(3))}performance.now()-Uw>250&&(Uw=performance.now(),Yv()),q(`sweep-time`).textContent=u?`${u.toFixed(1)} s`:`GOTOWY`,q(`sweep`).style.setProperty(`--cd`,Math.min(1,u/Ni[p].cooldown).toFixed(3)),q(`heal`).style.setProperty(`--cd`,Math.min(1,d/c.potionCooldown).toFixed(3));let _=Er(Z);q(`heal`).disabled=d>0||Z.hp>=by()||Ty||Ey||!_,q(`potion-count`).textContent!==String(_)&&(q(`potion-count`).textContent=String(_)),q(`heal`).classList.toggle(`empty`,!_),q(`heal-time`).textContent=d?`${Math.ceil(d)} s`:`MIKSTURA`,q(`fps`).textContent=`${Math.round(1/(Gy.reduce((e,t)=>e+t,0)/Math.max(1,Gy.length)||1))} FPS · ${Q.buildings.length} brył OSM`,q(`pause`).textContent=Ty?`▶`:`Ⅱ`,q(`pause`).setAttribute(`aria-label`,Ty?`Wznów grę`:`Pauza`),$>Wy&&q(`toast`).classList.remove(`on`),q(`damage-vignette`).style.opacity=$<Uy?`.55`:`0`}function Gw(){By.clear(),Ry=null,zy={x:0,z:0},Vy=!1,document.querySelectorAll(`.stick i`).forEach(e=>e.style.transform=``),Kw()}var Kw=()=>{};function qw(e){Ty=e,Gw(),Hb(),Ww(),e?zb(`Pauza — świat i przeciwnicy czekają.`):q(`toast`).classList.remove(`on`)}function Jw(e,t){Nb.setFromCamera(new B(e/innerWidth*2-1,1-t/innerHeight*2),vy),Pb.constant=-Lx(Z.x,Z.z);let n=Nb.ray.intersectPlane(Pb,Mb);n&&(Py=Math.atan2(n.x-Z.x,n.z-Z.z))}function Yw(){let e=[];function t(t,n){let r=q(t),i=null,a=0,o=0,s=!1,c=r.querySelector(`i`),l=()=>{i=null,c.style.transform=``,n?Vy=!1:zy={x:0,z:0}};e.push(l),r.addEventListener(`pointerdown`,e=>{!wy||Ty||Ey||Xw||(i=e.pointerId,a=e.clientX,o=e.clientY,s=!1,r.setPointerCapture(i),n&&(Vy=!0),e.preventDefault())}),r.addEventListener(`pointermove`,e=>{if(i!==e.pointerId)return;let t=e.clientX-a,l=e.clientY-o,u=Math.hypot(t,l),d=r.clientWidth*.34,f=Math.min(1,d/(u||1));if(c.style.transform=`translate(${t*f}px,${l*f}px)`,u>7&&(s=!0),n){if(u>5){let e=Ex(t,l);Py=Math.atan2(e.x,e.z)}}else zy={x:t*f/d,z:l*f/d}}),r.addEventListener(`pointerup`,e=>{i===e.pointerId&&(n&&Iw(!1,!s),l())}),r.addEventListener(`pointercancel`,l),r.addEventListener(`lostpointercapture`,l)}t(`move-stick`,!1),t(`attack-stick`,!0),Kw=()=>e.forEach(e=>e()),window.addEventListener(`keydown`,e=>{!wy||e.target instanceof HTMLInputElement||([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(e.code)&&e.preventDefault(),!(e.code===`Escape`&&e.defaultPrevented)&&(e.code===`KeyP`||e.code===`Escape`?!e.repeat&&!Ey&&qw(!Ty):Ty||Ey||Xw||ly||uy||(By.add(e.code),!e.repeat&&(e.code===`Space`&&Iw(!1,!0),e.code===`KeyQ`&&Iw(!0,!0),e.code===`KeyH`&&Rw(),e.code===`KeyR`&&eC(),e.code===`Comma`&&Ox(-Tx),e.code===`Period`&&Ox(Tx)))))}),window.addEventListener(`keyup`,e=>By.delete(e.code)),window.addEventListener(`blur`,()=>{wy&&qw(!0)}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&wy&&qw(!0)}),ay.addEventListener(`pointermove`,e=>{e.pointerType===`mouse`&&!Ty&&!Ey&&(ay.dataset.interaction=ty?.selected?`camp`:``,Ry={x:e.clientX,y:e.clientY},Jw(e.clientX,e.clientY))}),ay.addEventListener(`pointerdown`,e=>{e.pointerType===`mouse`&&e.button===0&&(ty.click(e.clientX,e.clientY)||(Jw(e.clientX,e.clientY),Iw()))});let n=new Map;ay.addEventListener(`pointerdown`,e=>{e.pointerType===`touch`&&n.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()})}),ay.addEventListener(`pointerup`,e=>{let t=n.get(e.pointerId),r=n.size>1;n.delete(e.pointerId),!(!t||r||performance.now()-t.t>400||Math.hypot(e.clientX-t.x,e.clientY-t.y)>12)&&ty.click(e.clientX,e.clientY)}),ay.addEventListener(`pointercancel`,e=>n.delete(e.pointerId)),ay.addEventListener(`contextmenu`,e=>e.preventDefault()),q(`sweep`).onclick=()=>Iw(!0,!0),q(`skill2`).onclick=()=>eC(),Ax(ay),q(`compass`).onclick=()=>wx=0,q(`heal`).onclick=Rw,q(`pause`).onclick=()=>qw(!Ty),q(`world-map`).addEventListener(`click`,()=>{Ey=!1,q(`help`).hidden=!0,Gw()}),q(`audio`).onclick=()=>{Rb=!Rb,Rb&&Vb(),q(`audio`).setAttribute(`aria-pressed`,String(Rb)),q(`audio`).textContent=Rb?`♫`:`♩`},q(`help-button`).onclick=()=>{Ey=!0,Gw(),q(`help`).hidden=!1,Ww()},q(`report-open`).onclick=async()=>{q(`help`).hidden=!0,q(`report`).hidden=!1;let e=oy?.getContext(),t=e?.getExtension(`WEBGL_debug_renderer_info`),n=Mn(Z,J.origin);q(`report-text`).value=await zv({Grafika:t&&e?String(e.getParameter(t.UNMASKED_RENDERER_WEBGL)):`?`,Tryb:cy?`lżejszy (telefon)`:`pełny`,Pełny_ekran:py,Przerysowania_świata:`${wS} (ostatnie ${Vx} ms w ${Jx} krokach, najdłuższy ${Yx} ms)`,Mapa:`${Y.tiles.size} kafli, ${Q.buildings.length} budynków${Y.error?`, błąd: `+Y.error:``}`,Miejsce:`${n.lat.toFixed(5)}, ${n.lon.toFixed(5)}`,Drużyna:`${Ur(J).length}, obozy ${J.camps.length}, liny ${J.camps.filter(e=>e.parentId).length+(J.connections?.length??0)}`,Wrogowie:Jy.filter(e=>e.state!==`dead`).length})},q(`report-copy`).onclick=async()=>{let e=q(`report-text`).value;try{await navigator.clipboard.writeText(e),zb(`Raport skopiowany — wklej go w rozmowie`)}catch{q(`report-text`).select(),document.execCommand?.(`copy`),zb(`Raport zaznaczony — skopiuj go`)}},q(`report-share`).onclick=async()=>{let e=q(`report-text`).value;navigator.share?await navigator.share({title:`ROPExpanse — raport`,text:e}).catch(()=>{}):zb(`Udostępnianie niedostępne — użyj Kopiuj`)},q(`report-download`).onclick=()=>{let e=q(`report-text`).value,t=document.createElement(`a`);t.href=URL.createObjectURL(new Blob([e],{type:`text/plain`})),t.download=`ropexpanse-raport-${new Date().toISOString().slice(0,16).replace(/[:T]/g,`-`)}.txt`,t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),1e3)},q(`report-close`).onclick=()=>{q(`report`).hidden=!0,Ey=!1,Gw()},q(`close-help`).onclick=()=>{Ey=!1,q(`help`).hidden=!0,Gw()},q(`reset`).onclick=()=>{try{localStorage.removeItem(Zv),localStorage.removeItem(Qv)}catch{}location.reload()},q(`start`).onclick=()=>{Y?.pin(Z),fr(J,Date.now());let e=J.pending?Object.values(J.pending).reduce((e,t)=>e+Math.floor(t),0):0;e>0&&setTimeout(()=>zb(`Kręgi wyprodukowały ${e} surowców — Skarbiec`),4e3),gy(),wy=!0,q(`loading`).hidden=!0,Qw.start(),Rb=!0,Vb(),q(`audio`).setAttribute(`aria-pressed`,`true`),zb(`Witaj w Lublinie. Postaw obóz i ruszaj w Mgłę.`)},q(`fullscreen`).onclick=()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):gy()},document.addEventListener(`fullscreenchange`,()=>{py=document.fullscreenElement?`active`:`idle`,requestAnimationFrame(()=>{Zw(),dy=3})}),window.addEventListener(`pagehide`,Hb)}var Xw=!1;function Zw(){let e=matchMedia(`(pointer: coarse)`).matches,t=e&&innerHeight>innerWidth;t!==Xw&&Gw(),Xw=t,q(`rotate-notice`).hidden=!t;let n=innerWidth/innerHeight,r=e&&innerWidth>innerHeight?10:innerWidth<700?19:16;vy.left=-r*n,vy.right=r*n,vy.top=r,vy.bottom=-r,vy.updateProjectionMatrix(),oy.setPixelRatio(cy?1:Math.min(devicePixelRatio,1.5)),oy.setSize(innerWidth,innerHeight),dy=3}var Qw=new Lf;function $w(){requestAnimationFrame($w);let e=Qw.getDelta(),t=Math.min(e,.075);if(Gy.push(e),wy&&!Ty&&!Ey&&Fv(e,()=>`redraws ${wS}, tiles ${Y?.tiles.size??0}${Y?.loading?` (loading)`:``}, ${Jy.filter(e=>e.state!==`dead`).length} enemies, ${wC.length} companions${ty?.rope?`, rope`:``}${ew?`, ride`:``}${Jb(Z)?`, safe`:``}`),Gy.length>90&&Gy.shift(),Cy&&wy&&!Ty&&!Ey&&!Xw&&!ly&&!uy){if($+=t,My>0)$>=My&&(My=0,Z.x=Sy.x,Z.z=Sy.z,Z.hp=by(),jy=$+2,Yy.forEach(e=>{X.remove(e.node),e.node.geometry.dispose(),e.node.material.dispose()}),Yy.length=0,Fb.set(Z.x,0,Z.z),Hb());else{let e=zy.x+(By.has(`KeyD`)||By.has(`ArrowRight`)?1:0)-(By.has(`KeyA`)||By.has(`ArrowLeft`)?1:0),n=zy.z+(By.has(`KeyS`)||By.has(`ArrowDown`)?1:0)-(By.has(`KeyW`)||By.has(`ArrowUp`)?1:0),r=Math.hypot(e,n);r>1&&(e/=r,n/=r),{x:e,z:n}=Ex(e,n),r>.08&&(qb(Z,e*c.speed*t*(Fy?.sweep?.6:1),n*c.speed*t*(Fy?.sweep?.6:1),c.radius),Vy||Fy||By.has(`Space`)||(Py=Math.atan2(e,n))),Ry&&!Fy&&Jw(Ry.x,Ry.y),Bw(t),A_(yy,t,r>.08,Fy?Fy.t/Fy.duration:0,Fy?.sweep??!1),yy.root.position.set(Z.x,0,Z.z),yy.root.rotation.y=Py,yy.root.rotation.z=0,Z.hp<by()&&(Jb(Z)||$-Dy>c.regenDelay)&&(Z.hp=Math.min(by(),Z.hp+t*(Jb(Z)?22:4)))}if(sw(t),lx(t),aS(t),$x(),bS(t),yx(t),Jb(Z)){let e=Kr(J,Z);e&&(Z.campId=e.id,Sy=e)}zw(t),Mw(t),PC(t),Vw(t),aC(),nC().update(t),Hw(t),Y&&!iy&&(UC(t,$),YC(t,$)),My>$&&(yy.root.rotation.z=Math.min(1,(1.1-(My-$))*3)*Math.PI*.4,yy.root.position.y=-.1),$-Ny>2&&(Hb(),Ny=$)}if(Cy&&wy&&ty.tick(t,$),!Cy||ly||uy)return;Fb.lerp(new V(Z.x,Lx(Z.x,Z.z),Z.z),1-Math.exp(-t*10)),Cx+=(wx-Cx)*(1-Math.exp(-t*12)),vy.position.set(Fb.x+Math.sin(Cx)*30,39+Fb.y,Fb.z+Math.cos(Cx)*30),kx(),vy.lookAt(Fb.x,Fb.y,Fb.z),Hy>0&&(vy.position.x+=(Math.random()-.5)*Hy,vy.position.z+=(Math.random()-.5)*Hy,!Ty&&!Ey&&(Hy=Math.max(0,Hy-t))),nx.group.position.set(Z.x,2.9+Lx(Z.x,Z.z),Z.z),xS(),nx.group.quaternion.copy(vy.quaternion),nx.fill.scale.x=l(Z.hp/by(),0,1);let n=Fy&&!Fy.ranged;if(Ib.visible=Vy||!!n,Ib.position.set(Z.x,.065,Z.z),Ib.rotation.set(-Math.PI/2,0,Py),Ib.scale.setScalar(Fy?.sweep?c.sweepReach/c.reach:1),Ib.material.opacity=n?.35:.18,qy+=t,qy>.1){qy=0;let e=new Set,t=[yy.root.position,...Jy.filter(e=>e.state!==`dead`&&u(Z,e.rig.root.position)<16).map(e=>e.rig.root.position)];for(let n of t){let t=n.clone().add(new V(0,.8,0)),r=vy.position.clone().sub(t),i=r.length();r.divideScalar(i);for(let n=.4;n<i;n+=.4){let i=t.x+r.x*n,a=t.y+r.y*n,o=t.z+r.z*n;if(a>40)break;for(let t of tb.get(jb(i,o))??[])!e.has(t)&&a<t.top&&i>=t.box.x0&&i<=t.box.x1&&o>=t.box.z0&&o<=t.box.z1&&m(i,o,[t.ring])&&e.add(t)}}for(let t of e)Eb.set(t,$+.6)}Db(t),($-Ky>.1||Ty||Ey||!wy)&&(Ww(),Ky=$);try{if(wb>0&&oy.shadowMap.enabled&&(wb--,oy.shadowMap.needsUpdate=!0),oy.render(X,vy),xb.length)for(let e of xb.splice(0))e.dispose();Ab(),dy>0&&(_y(),dy--)}catch(e){my(`Błąd rysowania świata: ${e instanceof Error?e.message:String(e)}`)}}var eT=`start`;function tT(){let e=()=>{if(Cy)return;let t=Y?`, kafle ${Y.tiles.size}${Y.error?`, błąd: `+Y.error:``}`:``;if(q(`loading-text`).textContent=`Wczytywanie trwa dłużej niż zwykle (etap: ${eT}${t}, wersja ${Iv}). Możesz poczekać albo wczytać grę ponownie — postęp jest zachowany.`,!document.getElementById(`loading-retry`)){let e=document.createElement(`button`);e.id=`loading-retry`,e.textContent=`Wyczyść pamięć mapy i wczytaj ponownie`,e.onclick=()=>{for(let e of[`ropexpanse-tiles`,`ropexpanse-world`])try{indexedDB.deleteDatabase(e)}catch{}location.reload()},q(`loading-text`).after(e)}window.setTimeout(e,3e3)};window.setTimeout(e,15e3)}async function nT(){try{tT(),q(`compatibility`).onclick=()=>{let e=new URL(location.href);e.searchParams.set(`quality`,`safe`),location.href=e.href},q(`reload-renderer`).onclick=()=>location.reload(),ay.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),ly=!0,my(`Telefon lub przeglądarka przerwały rysowanie 3D. Postęp jest zachowany. Czekam na przywrócenie obrazu; możesz też wczytać grę ponownie.`)}),ay.addEventListener(`webglcontextrestored`,()=>{ly=!1,uy=``,dy=3,q(`renderer-error`).hidden=!0,oy.shadowMap.needsUpdate=!cy,Qw.getDelta(),Zw()}),oy=new rg({canvas:ay,antialias:!cy,alpha:!1,powerPreference:cy?`default`:`high-performance`,preserveDrawingBuffer:cy,precision:cy?`mediump`:`highp`});let e=oy.getContext().getExtension(`WEBGL_lose_context`);oy.debug.onShaderError=()=>my(`Układ graficzny nie skompilował efektów 3D. Uruchom tryb zgodności.`),oy.shadowMap.enabled=!cy,oy.shadowMap.type=2,oy.outputColorSpace=ao,oy.toneMapping=7,oy.toneMappingExposure=.9,eT=`mapa startowa`;let t=await fetch(`combat3d/lublin.json`);if(!t.ok)throw Error(`Mapa: HTTP ${t.status}`);if(Q=await t.json(),ey&&Math.hypot(Q.origin.lat-J.origin.lat,Q.origin.lon-J.origin.lon)>1e-6?(Y=db(J.origin),eT=`mapa okolicy (zapisana gra)`,await Y.load(Z),Q=Y.snapshot()):(Y=db(J.origin,Q),Y.contains(Z)||(eT=`mapa okolicy`,await Y.load(Z),Q=Y.snapshot())),eT=`budowanie świata`,Sx(),ty=new Ev({scene:X,camera:vy,state:J,blocked:(e,t)=>Gb(e.x,e.z,t),obstacles:()=>Q.buildings,contains:e=>Y.contains(e),combat:()=>$-Dy<5||!!Fy,canAct:()=>Cy&&wy&&!Ty&&!Ey&&!Xw&&!ly&&!uy&&My<=$,notify:zb,save:Hb,switch:MS,party:()=>kC(),ground:(e,t)=>Lx(e,t),drape:e=>Rx(e),panel:e=>{Ey=e,Gw()},travel:ow,ropeTravel:iw,campPitched:aw,retry:()=>Y.retry(),worldStatus:()=>({loading:Y.loading&&!Y.contains(Z,12),error:Y.error})}),ty.countBuildings(),sy){let e=new Map,t=t=>{if(!(t instanceof Od))return t;let n=e.get(t);return n||(n=new Gc({color:t.color,vertexColors:t.vertexColors,transparent:t.transparent,opacity:t.opacity,side:t.side,depthWrite:t.depthWrite}),e.set(t,n)),n};X.traverse(e=>{e instanceof W&&(e.material=Array.isArray(e.material)?e.material.map(t):t(e.material))})}oy.shadowMap.autoUpdate=!1,oy.shadowMap.needsUpdate=!0,Yw(),Zw(),window.addEventListener(`resize`,Zw),mS=new Set(J.explored??[]),kg(mS,Mn(Z,J.origin)),J.explored=[...mS],_S(),kC(),Cy=!0,q(`loading-text`).textContent=``,q(`start`).hidden=!1,Ww(),$w(),Object.assign(window,{__combat3d:{snapshot:()=>({ready:Cy,started:wy,paused:Ty,helpOpen:Ey,orientationHeld:Xw,compatibility:cy,safeGraphics:sy,contextLost:ly,rendererFault:uy,frameHealthy:fy,fullscreenState:py,time:$,player:{...Z},home:{...Sy},weapon:xy,campaign:JSON.parse(JSON.stringify(J)),rope:ty.rope,resources:QC(),rates:J.rates??null,vents:ZC(),rescues:[...GC.values()].map(e=>({key:e.spot.key,x:e.spot.x,z:e.spot.z,state:e.state})),pending:J.pending??null,spots:ty.spotCount,spotPoints:ty.spotPoints,world:{origin:J.origin,tiles:Y.tiles.size,loading:Y.loading,error:Y.error},sweepReady:ky,skill:Pi(Z),skill2:Ii(Z),taunt:$<XS,manaShield:$<QS?ZS:0,potionReady:Ay,attack:Fy?{...Fy}:null,companions:wC.map(e=>({id:e.c.id,x:e.c.x,z:e.c.z,hp:e.c.hp,role:e.c.role})),enemies:Jy.map(e=>({id:e.id,key:e.key,species:e.species.id,behavior:e.behavior,hidden:e.hidden,x:e.rig.root.position.x,z:e.rig.root.position.z,hp:e.hp,state:e.state,kind:e.kind,tier:e.tier,boss:e.boss})),map:{buildings:Q.buildings.length,roads:Q.roads.length,source:Y.tiles.size?`world map tiles`:`bundled Lublin extract`},drawCalls:oy.info.render.calls,timeOfDay:dw,weather:fw,cameraYaw:wx,renders:wS,draws:oy?.info.render.calls??0,triangles:oy?.info.render.triangles??0,faded:Qy.filter(e=>e.fade<1).length,drops:Sw.map(e=>({coin:e.coin??0,slot:e.item?.slot??null,rarity:e.item?.rarity??null,landed:e.landed,x:e.x,z:e.z})),trees:TS,terrain:Mx.w?{cells:Mx.w,version:Mx.version,min:Mx.v.reduce((e,t)=>Math.min(e,t),99),max:Mx.v.reduce((e,t)=>Math.max(e,t),-99),here:Mx.at(Z.x,Z.z)}:null}),...new URLSearchParams(location.search).has(`qa`)?{fixture:e=>{iy=!0,Gw(),Fy=null,Yy.forEach(e=>X.remove(e.node)),Yy.length=0,rC.length=0,nC().clear();for(let e of Jy)e.state=`dead`,e.hp=0,e.respawn=9999,e.rig.root.visible=!1,e.warning.visible=!1,e.bar.visible=!1;let t=ex({x:Sy.x+10,z:Sy.z+10});Z.x=t.x,Z.z=t.z,Z.hp=by(),Dy=$,jy=0,Fb.set(Z.x,0,Z.z);let n=Jy[0];if(e!==`empty`){n.rig.root.visible=!0,n.hidden=!1,n.behavior=n.kind===`wolf`?`pack`:n.kind===`archer`?`shooter`:n.kind===`mage`?`caster`:`charge`,n.behavior===`charge`&&(n.behavior=`pack`),n.fleeUntil=0,n.rig.root.scale.setScalar(1),n.rig.root.rotation.z=0,n.state=`idle`,n.hp=n.maxHp=100,n.spawn=ex({x:t.x,z:t.z-2});for(let e=0;e<Math.PI*2;e+=.2){let r={x:t.x+Math.sin(e)*2,z:t.z+Math.cos(e)*2};if(!Gb(r.x,r.z,.7)&&Kb(t,r)){n.spawn=r;break}}n.rig.root.position.set(n.spawn.x,0,n.spawn.z),n.timer=e===`duel`?0:100,n.state=e===`duel`?`idle`:`recover`,n.hit=!1,Py=Math.atan2(n.spawn.x-t.x,n.spawn.z-t.z)}if(e===`patrol`&&(Object.assign(Z,{x:Sy.x,z:Sy.z}),n.state=`idle`,n.timer=0,n.wanderTarget=null,n.wanderWait=0,n.spawn=ex({x:Sy.x+12,z:Sy.z}),n.rig.root.position.set(n.spawn.x,0,n.spawn.z),Fb.set(Z.x,0,Z.z)),e===`hurt`&&(Z.hp=25),e===`death`&&Pw(999,!0),e===`behind`){let e=Qy.filter(e=>Math.abs(e.box.x0-Z.x)<150&&Math.abs(e.box.z0-Z.z)<150).sort((e,t)=>t.data.height-e.data.height)[0];if(e){let t=ex({x:(e.box.x0+e.box.x1)/2,z:e.box.z0-.9},.5);Z.x=t.x,Z.z=t.z,Fb.set(t.x,0,t.z)}}if(e===`wall`){let e=Qy.find(e=>Math.abs(e.box.x0)<30);if(e){let t=ex({x:e.box.x0-1,z:(e.box.z0+e.box.z1)/2});Z.x=t.x,Z.z=t.z}}return{x:Z.x,z:Z.z}},camp:()=>{Z.x=Sy.x,Z.z=Sy.z,Dy=$-10,Fb.set(Z.x,0,Z.z)},advanceOffers:e=>{for(let t of J.offers)t.readyAt=Date.now()-1,e!==void 0&&(t.seed=e,delete t.pool);jS()},setRope:e=>{J.stock.rope=e},travel:(e,t)=>ow({lat:e,lon:t}),pickRope:(e,t,n)=>ty.pickRope({x:e,z:t},n),companion:e=>{let t={...JSON.parse(JSON.stringify(Z)),id:`qa-${e}-${++J.serial}`,name:{warrior:`Bogdan`,mage:`Bogna`,archer:`Hugo`,herbalist:`Zofia`}[e],role:e,appearance:120+J.serial,bag:[],equipment:{},weapon:e===`warrior`?`sword`:`magic`,coins:0};return Object.assign(t,ex({x:Z.x-2,z:Z.z-2})),t.hp=Nr(t),J.characters.push(t),J.party=[...Ur(J),t.id],kC(),t.id},vent:()=>{let e=ex({x:Z.x+14,z:Z.z},2.6),t={key:`qa:vent`,x:e.x,z:e.z,seed:4242},n={vent:t,view:new H,state:`idle`,cubes:[]};return n.view.position.set(e.x,0,e.z),VC(n),X.add(n.view),RC.set(t.key,n),e},killWave:()=>{for(let e of Jy)(e.key.startsWith(`vent:`)||e.key.startsWith(`rescue:`))&&e.state!==`dead`&&Nw(e,99999)},rescue:()=>{let e=ex({x:Z.x+14,z:Z.z},1.5);return qC({key:`qa:rescue`,x:e.x,z:e.z,seed:987654}),e},face:(e,t)=>{for(let n=0;n<Math.PI*2;n+=.3){let r={x:e+Math.sin(n)*2.2,z:t+Math.cos(n)*2.2};if(!Gb(r.x,r.z,c.radius))return Z.x=r.x,Z.z=r.z,Py=Math.atan2(e-r.x,t-r.z),Fb.set(Z.x,0,Z.z),!0}return!1},production:(e,t)=>{GS={wood:0,ore:0,fiber:0,herbs:0,...e},J.rates=GS,J.producedAt=Date.now()-t*36e5,WS={circles:te(J),map:Q},fr(J,Date.now())},faceNode:e=>{HS(!0);let t=[...zS.values()].find(t=>t.view.visible&&t.node.kind===e);if(!t)return null;for(let e=0;e<Math.PI*2;e+=.3){let n={x:t.node.x+Math.sin(e)*1.6,z:t.node.z+Math.cos(e)*1.6};if(!Gb(n.x,n.z,c.radius)&&Kb(n,t.node))return Z.x=n.x,Z.z=n.z,Py=Math.atan2(t.node.x-n.x,t.node.z-n.z),Fb.set(Z.x,0,Z.z),t.node.key}return null},spawnSpecies:(e,t=5)=>vw(ex({x:Z.x+Math.sin(Py)*t,z:Z.z+Math.cos(Py)*t}),4e3+Jy.length,`qa:${e}:${Jy.length}`,Bg(e)).key,equipTemplate:e=>{let t=Vr(J,e);return t.slot!==`material`&&(Z.equipment[t.slot]=t),yw(Fi(Z)),t.icon},dropLoot:(e,t)=>Ow({x:Z.x+3,z:Z.z},e,t.map((e,t)=>Vr(J,t,1,e))),killNearest:()=>{let e=Jy.filter(e=>e.state!==`dead`).sort((e,t)=>u(e.rig.root.position,Z)-u(t.rig.root.position,Z))[0];return e&&Nw(e,99999,Z),e?{look:e.species.look,rank:e.species.rank}:null},setHp:e=>{Z.hp=e,Dy=$+30},cast:e=>{let t=cC(Z,16);return t&&(Py=Math.atan2(t.rig.root.position.x-Z.x,t.rig.root.position.z-Z.z)),Dy=$,vC(Z,e,Z,Py)},enemyStatus:()=>Jy.filter(oC).map(e=>({hp:e.hp,slowed:(e.slowUntil??0)>$,frozen:(e.frozenUntil??0)>$,burning:(e.burnUntil??0)>$})),fillBag:()=>{let e=[`common`,`rare`,`epic`,`legendary`];for(let t=0;t<9;t++)xr(Z.bag,Vr(J,t+2,1+t%3,e[t%4]),or.slots);for(let e=0;e<5;e++)xr(Z.bag,Br(J,`skora`),or.slots);for(let e=0;e<3;e++)xr(Z.bag,Br(J,`kiel`),or.slots);return Z.bag.length},grantGold:e=>{Z.coins=e},moveTo:(e,t)=>{Gb(e,t,c.radius)||(Z.x=e,Z.z=t,Dy=$-10)},hurt:e=>Pw(e,!0),fixedRolls:(e=!0)=>{AC=e},attack:(e=!1)=>Iw(e,!0),potion:Rw,loseContext:()=>e?.loseContext(),restoreContext:()=>e?.restoreContext()}:{}}})}catch(e){q(`loading-text`).textContent=`Nie udało się uruchomić gry: ${e instanceof Error?e.message:String(e)}`;let t=document.createElement(`button`);t.textContent=`Spróbuj ponownie`,t.onclick=()=>location.reload(),q(`loading-text`).after(t),console.error(e)}}nT();