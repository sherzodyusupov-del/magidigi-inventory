# Magidigi Inventory

Activation inventory and site-deployment tracker for Magidigi (Zeekr / Jaecoo displays).
A single static page (`index.html`, no build step) with an optional Supabase backend.

## What it does
- Stock by storage zone (Kennards F008, Inbound Transit, more can be added)
- Sites: reserve, pack and dispatch, verify on site with photos, swap, plan teardown, dismantle
- Every unit movement recorded in a ledger (from where, to where, who, when)
- Availability forecast by date and zone
- Logbook of every change, confirmed or flagged by Jojo / Karsten
- Product photos from the activation cheat sheet, click to enlarge

## Status
Demo. Data in the shipped catalog is made up. The sign-in is a shared password checked
inside the page, and the database policy is open to the public anon key.
Do not enter real stock until per-user logins (Supabase Auth) replace both.

## Run
Open `index.html` in a browser. Without Supabase settings it stores data in that browser only.

## Supabase
1. Run `supabase/migrations/20261117000000_init_app_state.sql` in the SQL editor.
2. Put the project URL and anon key in the app (Logbook > Settings, admin only).
   Never use the `service_role` key in this repo or in the page.

## Deploy
Static hosting (Netlify, Cloudflare Pages). Publish directory: repository root. No build command.
