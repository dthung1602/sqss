UPDATE styles
SET "background" = 'red',
    "color"      = 'white'
WHERE "[title]" = 'help text';

UPDATE styles
SET "background" = 'orangered',
    "color"      = 'white'
WHERE "[title]" != 'help text';

UPDATE styles
SET "background" = 'orange',
    "color"      = 'white'
WHERE "[title]" LIKE 'help text';

UPDATE styles
SET "background" = 'darkorange',
    "color"      = 'white'
WHERE "[title]" NOT LIKE 'help text';

UPDATE styles
SET "background" = 'yellow',
    "color"      = 'white'
WHERE "[title]" LIKE '%help text';

UPDATE styles
SET "background" = 'yellowgreen',
    "color"      = 'white'
WHERE "[title]" NOT LIKE '%help text';

UPDATE styles
SET "background" = 'green',
    "color"      = 'white'
WHERE "[title]" LIKE 'help text%';

UPDATE styles
SET "background" = 'cyan',
    "color"      = 'white'
WHERE "[title]" NOT LIKE 'help text%';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help text%';

UPDATE styles
SET "background" = 'darkblue',
    "color"      = 'white'
WHERE "[title]" NOT LIKE '%help text%';

UPDATE styles
SET "background" = 'purple',
    "color"      = 'white'
WHERE "[title]" IS NULL;

UPDATE styles
SET "background" = 'violet',
    "color"      = 'white'
WHERE "[title]" IS NOT NULL;

UPDATE styles
SET "background" = 'black',
    "color"      = 'white'
WHERE "[title]"  = NULL;

UPDATE styles
SET "background" = 'white',
    "color"      = 'white'
WHERE "[title]" != NULL;
