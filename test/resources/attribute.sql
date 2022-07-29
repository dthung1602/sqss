UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" = 'help text';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" != 'help text';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help text';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" NOT LIKE '%help text';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE 'help text%';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" NOT LIKE 'help text%';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help text%';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" NOT LIKE '%help text%';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" IS NULL;

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" IS NOT NULL;
