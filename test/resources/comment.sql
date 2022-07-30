-- begin of file comment
UPDATE styles
SET -- in line comment color = 'blue'
color = 'red'
"--moz-extension" = '--not-a-comment'
WHERE id = 'target'
-- more comment
-- multiline comment
;
-- end of file comment