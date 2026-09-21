-- ============================================================
-- Musty's Map — Cal Poly Campus Locations
--
-- COORDINATES: rows marked (approx) are estimates and need to be
-- verified against the real campus map before launch. The five
-- unmarked rows were carried over from a prior project and are known good.
-- Easiest way to fix: drop a pin in Apple/Google Maps, copy lat/lng.
-- ============================================================

insert into locations (slug, name, category, lat, lng, building) values

  -- ─── Dining ───────────────────────────────────────────────────────────────
  ('1901-marketplace',  '1901 Marketplace',       'dining', 35.3085000, -120.6520000, 'Poly Canyon Village'),  -- approx
  ('campus-market',     'Campus Market',          'dining', 35.3005000, -120.6610000, null),
  ('vista-grande',      'Vista Grande',           'dining', 35.3045000, -120.6580000, null),                   -- approx
  ('the-avenue',        'The Avenue',             'dining', 35.3007000, -120.6608000, 'University Union'),      -- approx
  ('mustang-station',   'Mustang Station',        'dining', 35.3060000, -120.6555000, null),                   -- approx
  ('village-market',    'Village Market',         'dining', 35.3080000, -120.6525000, 'Poly Canyon Village'),  -- approx
  ('julians-library',   'Julian''s Café',         'dining', 35.3021000, -120.6624000, 'Kennedy Library'),       -- approx
  ('poly-deli',         'Poly Deli',              'dining', 35.3003000, -120.6612000, null),                   -- approx

  -- ─── Study ────────────────────────────────────────────────────────────────
  ('kennedy-library',   'Kennedy Library',        'study',  35.3022000, -120.6625000, null),
  ('university-union',  'University Union',       'study',  35.3008000, -120.6605000, null),
  ('dexter-lawn',       'Dexter Lawn',            'study',  35.3010000, -120.6595000, null),
  ('bonderson',         'Bonderson Projects Ctr', 'study',  35.2995000, -120.6585000, null),                   -- approx
  ('orfalea-college',   'Orfalea College of Bus', 'study',  35.3015000, -120.6588000, null),                   -- approx
  ('baker-science',     'Baker Science',          'study',  35.3000000, -120.6600000, null),                   -- approx
  ('engineering-iv',    'Engineering IV',         'study',  35.2990000, -120.6580000, null),                   -- approx

  -- ─── Recreation ───────────────────────────────────────────────────────────
  ('rec-center',        'Recreation Center',      'recreation', 35.2998000, -120.6590000, null),
  ('sports-complex',    'Sports Complex',         'recreation', 35.2975000, -120.6650000, null),               -- approx
  ('mott-gym',          'Mott Athletics Center',  'recreation', 35.2985000, -120.6620000, null);               -- approx
