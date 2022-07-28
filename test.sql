UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE "::after" is not true
  AND ("[title]" LIKE '%abc%' or ":after" is not false or "id" = 'xyz')
  and (element = '1fakjdf' or id = '123');
