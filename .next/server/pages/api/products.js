"use strict";(()=>{var e={};e.id=221,e.ids=[221],e.modules={1287:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5900:e=>{e.exports=require("pg")},6249:(e,r)=>{Object.defineProperty(r,"l",{enumerable:!0,get:function(){return function e(r,t){return t in r?r[t]:"then"in r&&"function"==typeof r.then?r.then(r=>e(r,t)):"function"==typeof r&&"default"===t?r:void 0}}})},4710:(e,r,t)=>{t.r(r),t.d(r,{config:()=>c,default:()=>d,routeModule:()=>E});var o={};t.r(o),t.d(o,{default:()=>a});var n=t(1802),p=t(7153),i=t(6249),u=t(1004),s=t.n(u);async function a(e,r){if("GET"!==e.method)return r.status(405).end();let{category:t,featured:o,search:n,limit:p=50,offset:i=0}=e.query;try{let e=["p.active = true"],u=[],a=1;t&&(e.push(`p.category = $${a}`),u.push(t),a++),"true"===o&&e.push("p.featured = true"),n&&(e.push(`(p.name ILIKE $${a} OR p.description ILIKE $${a})`),u.push(`%${n}%`),a++);let d=e.length?"WHERE "+e.join(" AND "):"",c=await s().query(`SELECT 
        p.*,
        COALESCE(json_agg(
          json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'size', pv.size,
            'color', pv.color,
            'color_hex', pv.color_hex,
            'stock', pv.stock,
            'price_override', pv.price_override
          ) ORDER BY pv.size, pv.color
        ) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) FILTER (WHERE r.approved = true) as review_count
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id AND r.approved = true
      ${d}
      GROUP BY p.id
      ORDER BY p.featured DESC, p.created_at DESC
      LIMIT $${a} OFFSET $${a+1}`,[...u,parseInt(p),parseInt(i)]);r.status(200).json({products:c.rows,total:c.rows.length})}catch(e){console.error(e),r.status(500).json({error:"Error al obtener productos"})}}let d=(0,i.l)(o,"default"),c=(0,i.l)(o,"config"),E=new n.PagesAPIRouteModule({definition:{kind:p.x.PAGES_API,page:"/api/products",pathname:"/api/products",bundlePath:"",filename:""},userland:o})},1004:(e,r,t)=>{let{Pool:o}=t(5900),n=new o({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});e.exports={query:(e,r)=>n.query(e,r),pool:n}},7153:(e,r)=>{var t;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(t||(t={}))},1802:(e,r,t)=>{e.exports=t(1287)}};var r=require("../../webpack-api-runtime.js");r.C(e);var t=r(r.s=4710);module.exports=t})();