UPDATE styles
SET "background"  = 'red'
WHERE "::after" = true;

UPDATE styles
SET "background"  = 'yellowgreen'
WHERE "::after" != false;

UPDATE styles
SET "background"  = 'green'
WHERE "::after" IS TRUE;

UPDATE styles
SET "background"  = 'purple'
WHERE "::after" IS NOT false;