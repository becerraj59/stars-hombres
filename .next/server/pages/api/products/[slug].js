"use strict";(()=>{var e={};e.id=87,e.ids=[87],e.modules={1287:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5900:e=>{e.exports=require("pg")},6249:(e,r)=>{Object.defineProperty(r,"l",{enumerable:!0,get:function(){return function e(r,t){return t in r?r[t]:"then"in r&&"function"==typeof r.then?r.then(r=>e(r,t)):"function"==typeof r&&"default"===t?r:void 0}}})},76:(e,r,t)=>{t.r(r),t.d(r,{config:()=>d,default:()=>c,routeModule:()=>l});var o={};t.r(o),t.d(o,{default:()=>p});var n=t(1802),i=t(7153),s=t(6249),a=t(1004),u=t.n(a);async function p(e,r){let{slug:t}=e.query;if("GET"===e.method)try{let e=await u().query(`SELECT 
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
          COALESCE(
            json_agg(
              json_build_object(
                'id', r.id,
                'customer_name', r.customer_name,
                'rating', r.rating,
                'comment', r.comment,
                'created_at', r.created_at
              ) ORDER BY r.created_at DESC
            ) FILTER (WHERE r.id IS NOT NULL AND r.approved = true),
            '[]'
          ) as reviews
        FROM products p
        LEFT JOIN product_variants pv ON pv.product_id = p.id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.slug = $1 AND p.active = true
        GROUP BY p.id`,[t]);if(!e.rows[0])return r.status(404).json({error:"Producto no encontrado"});let o=e.rows[0],n=await u().query(`SELECT p.id, p.slug, p.name, p.base_price, p.images, p.category
         FROM products p
         WHERE p.category = $1 AND p.slug != $2 AND p.active = true
         LIMIT 4`,[o.category,t]);r.status(200).json({product:o,related:n.rows})}catch(e){console.error(e),r.status(500).json({error:"Error al obtener producto"})}else r.status(405).end()}let c=(0,s.l)(o,"default"),d=(0,s.l)(o,"config"),l=new n.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/products/[slug]",pathname:"/api/products/[slug]",bundlePath:"",filename:""},userland:o})},1004:(e,r,t)=>{let{Pool:o}=t(5900),n=new o({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});e.exports={query:(e,r)=>n.query(e,r),pool:n}},7153:(e,r)=>{var t;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(t||(t={}))},1802:(e,r,t)=>{e.exports=t(1287)}};var r=require("../../../webpack-api-runtime.js");r.C(e);var t=r(r.s=76);module.exports=t})();