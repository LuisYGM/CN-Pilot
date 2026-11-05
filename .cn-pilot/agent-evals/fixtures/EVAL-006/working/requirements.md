# Acceptance: percentage discount
- `percent` is a percentage in the inclusive range 0..100.
- `price` is a nonnegative dollar amount; the output is rounded to cents using conventional half-up rounding.
- 0% returns the original amount; 100% returns zero.
- No mutation of the input.
- Evidence package contains the actual code diff, affected paths, these criteria, and the already-passing targeted test output.
