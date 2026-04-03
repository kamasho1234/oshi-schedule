const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3005/settings", { waitUntil: "networkidle2", timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const now = new Date().toISOString();
    const d = (offset) => { const dt = new Date(); dt.setDate(dt.getDate() + offset); return dt.toISOString().slice(0,10); };
    const cm = new Date().toISOString().slice(0,7);

    localStorage.clear();
    localStorage.setItem("oshi-schedule-onboarded", "1");
    localStorage.setItem("oshi-schedule-reset-v1", "1");
    localStorage.setItem("oshi-schedule-a2hs-dismissed", "1");

    localStorage.setItem("oshi-schedule-oshi", JSON.stringify([
      { id:"o1", name:"SHO", oshiType:"individual", image:"/img/band2.jpg", images:[{id:"i1",data:"/img/band3.jpg",createdAt:now},{id:"i2",data:"/img/band5.jpg",createdAt:now}], birthday:"2000-07-15", showBirthday:true, genre:"band", group:"VOID CHROME", snsLinks:[{platform:"twitter",url:"https://x.com/"}], memo:"ギター&ボーカル担当", themeColor:"#ef4444", createdAt:now, updatedAt:now },
      { id:"o2", name:"HARUKI", oshiType:"individual", image:"/img/midol1.jpg", images:[{id:"i3",data:"/img/midol2.jpg",createdAt:now}], birthday:"2001-03-22", showBirthday:true, genre:"idol", group:"PRISM NOVA", snsLinks:[{platform:"twitter",url:"https://x.com/"}], memo:"センター", themeColor:"#8b5cf6", createdAt:now, updatedAt:now },
      { id:"o3", name:"HINA", oshiType:"individual", image:"/img/idol2.jpg", images:[{id:"i5",data:"/img/idol3.jpg",createdAt:now}], birthday:"2002-11-03", showBirthday:true, genre:"idol", group:"Lumi Fleur", snsLinks:[], memo:"歌唱力抜群", themeColor:"#ec4899", createdAt:now, updatedAt:now },
    ]));

    localStorage.setItem("oshi-schedule-events", JSON.stringify([
      { id:"e1", title:"VOID CHROME Solo Live", date:d(2), startTime:"18:00", endTime:"21:00", category:"live", oshiId:"o1", location:"横浜アリーナ", memo:"SS席", isAllDay:false, createdAt:now, updatedAt:now },
      { id:"e2", title:"PRISM NOVA 生配信", date:d(4), startTime:"21:00", category:"streaming", oshiId:"o2", memo:"", isAllDay:false, createdAt:now, updatedAt:now },
      { id:"e3", title:"Lumi Fleur ファンミ", date:d(6), startTime:"13:00", category:"live", oshiId:"o3", location:"幕張メッセ", memo:"", isAllDay:false, createdAt:now, updatedAt:now },
      { id:"e4", title:"VOID CHROME 全国ツアー大阪", date:d(10), startTime:"17:00", category:"live", oshiId:"o1", location:"大阪城ホール", memo:"", isAllDay:false, createdAt:now, updatedAt:now },
    ]));

    localStorage.setItem("oshi-schedule-goods", JSON.stringify([
      { id:"g1", name:"ペンライト", image:"/img/vc_penlight1.jpg", category:"penlight", price:3500, oshiId:"o1", memo:"", createdAt:now, updatedAt:now },
      { id:"g2", name:"推しタオル", image:"/img/vc_towel1.jpg", category:"towel", price:2000, oshiId:"o1", memo:"", createdAt:now, updatedAt:now },
      { id:"g3", name:"Tシャツ", image:"/img/vc_tshirt1.jpg", category:"tshirt", price:4000, oshiId:"o1", memo:"", createdAt:now, updatedAt:now },
      { id:"g4", name:"ペンライト", image:"/img/penlight2.jpg", category:"penlight", price:3500, oshiId:"o2", memo:"", createdAt:now, updatedAt:now },
      { id:"g5", name:"アクスタ", image:"/img/acrylic3.jpg", category:"acrylic", price:1500, oshiId:"o2", memo:"", createdAt:now, updatedAt:now },
      { id:"g6", name:"ペンライト", image:"/img/lf_penlight1.jpg", category:"penlight", price:3500, oshiId:"o3", memo:"", createdAt:now, updatedAt:now },
      { id:"g7", name:"タオル", image:"/img/lf_towel1.jpg", category:"towel", price:2000, oshiId:"o3", memo:"", createdAt:now, updatedAt:now },
    ]));

    localStorage.setItem("oshi-schedule-expenses", JSON.stringify([
      { id:"x1", amount:12000, date:cm+"-28", category:"ticket", oshiId:"o1", memo:"Solo Liveチケット", createdAt:now, updatedAt:now },
      { id:"x2", amount:9500, date:cm+"-20", category:"goods", oshiId:"o1", memo:"ペンライト+タオル+Tシャツ", createdAt:now, updatedAt:now },
      { id:"x3", amount:8500, date:cm+"-15", category:"ticket", oshiId:"o2", memo:"ファンミチケット", createdAt:now, updatedAt:now },
      { id:"x4", amount:5000, date:cm+"-12", category:"goods", oshiId:"o2", memo:"ペンライト+アクスタ", createdAt:now, updatedAt:now },
      { id:"x5", amount:5500, date:cm+"-10", category:"goods", oshiId:"o3", memo:"ペンライト+タオル", createdAt:now, updatedAt:now },
      { id:"x6", amount:3500, date:cm+"-05", category:"transport", oshiId:"o1", memo:"横アリ交通費", createdAt:now, updatedAt:now },
      { id:"x7", amount:15000, date:cm+"-03", category:"ticket", oshiId:"o1", memo:"大阪公演チケット", createdAt:now, updatedAt:now },
      { id:"x8", amount:8000, date:cm+"-03", category:"accommodation", oshiId:"o1", memo:"大阪宿泊", createdAt:now, updatedAt:now },
    ]));
  });

  const screens = [
    ["/dashboard", "sample_dashboard"],
    ["/calendar", "sample_calendar"],
    ["/goods", "sample_goods"],
    ["/expenses", "sample_expenses"],
    ["/oshi", "sample_oshi"],
  ];
  for (const [url, name] of screens) {
    await page.goto("http://localhost:3005" + url, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: name + ".png" });
    console.log("captured " + url);
  }

  // Profile
  await page.goto("http://localhost:3005/oshi/o1", { waitUntil: "networkidle2", timeout: 20000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: "sample_profile.png" });
  console.log("captured profile");

  // Share card
  await page.goto("http://localhost:3005/dashboard", { waitUntil: "networkidle2", timeout: 20000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const shareBtn = btns.find(b => {
      const paths = b.querySelectorAll("path");
      for (const p of paths) { if (p.getAttribute("d") && p.getAttribute("d").includes("7.217")) return true; }
      return false;
    });
    if (shareBtn) shareBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "sample_share.png" });
  console.log("captured share");

  await browser.close();
  console.log("done");
})().catch(e => console.error(e));
