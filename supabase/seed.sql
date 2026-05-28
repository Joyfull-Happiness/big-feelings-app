-- Run this after schema.sql to populate the pit with starter entries

insert into posts (text, feelings) values
  ('I gave everything to that project and they just handed the credit to someone who showed up for the last two weeks.', '[{"label":"frustrated","category":"mad"},{"label":"insignificant","category":"scared"}]'),
  ('My best friend got engaged and I smiled and said all the right things but inside I felt this ugly jealousy I didn''t know what to do with.', '[{"label":"jealous","category":"mad"},{"label":"lonely","category":"sad"}]'),
  ('I keep refreshing my email even though it''s been four days and I already know what the silence means.', '[{"label":"anxious","category":"scared"},{"label":"helpless","category":"scared"}]'),
  ('My therapist cancelled on me for the third time this month and I can''t even be mad because I know she''s busy.', '[{"label":"rejected","category":"scared"},{"label":"lonely","category":"sad"}]'),
  ('I overheard my coworkers planning lunch without me again.', '[{"label":"lonely","category":"sad"},{"label":"embarrassed","category":"scared"}]'),
  ('Everyone keeps telling me how strong I am and I want to scream because I''m not strong I''m just too tired to fall apart where anyone can see me.', '[{"label":"tired","category":"sad"},{"label":"overwhelmed","category":"scared"}]'),
  ('I said I''m fine eleven times today. I counted.', '[{"label":"lonely","category":"sad"},{"label":"apathetic","category":"sad"}]'),
  ('My mom called and I let it go to voicemail. Then I listened to it three times. She just wanted to know if I''d eaten today. I hadn''t.', '[{"label":"guilty","category":"sad"},{"label":"ashamed","category":"sad"}]'),
  ('I finished the marathon and the first thing I thought at the finish line was that my dad would never know.', '[{"label":"proud","category":"powerful"},{"label":"lonely","category":"sad"}]'),
  ('She hid under the bed for four hours then came out and put her paw on my hand. I haven''t been chosen by anyone in so long.', '[{"label":"hopeful","category":"joyful"},{"label":"thankful","category":"peaceful"}]'),
  ('I got the job and the first person I wanted to tell was the friend I cut off six months ago.', '[{"label":"excited","category":"joyful"},{"label":"lonely","category":"sad"}]'),
  ('My kid drew a picture of our family today and I''m in it. After the divorce I wasn''t sure I would be.', '[{"label":"thankful","category":"peaceful"},{"label":"hopeful","category":"joyful"}]'),
  ('I don''t want advice. I don''t want perspective. I just want someone to say yeah that really sucks.', '[{"label":"frustrated","category":"mad"},{"label":"lonely","category":"sad"}]'),
  ('I''m so tired of being the one who reaches out first.', '[{"label":"tired","category":"sad"},{"label":"lonely","category":"sad"}]'),
  ('Nobody tells you that grief isn''t a phase. It''s a room you keep walking back into.', '[{"label":"lonely","category":"sad"},{"label":"helpless","category":"scared"}]');
