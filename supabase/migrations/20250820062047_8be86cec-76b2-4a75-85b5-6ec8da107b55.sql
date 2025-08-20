-- Create sample posts and images for demonstration
-- Using realistic UUIDs for post IDs

-- First, let's create some demo posts with proper UUID format
INSERT INTO posts (id, user_id, caption, likes_count, comments_count, created_at) VALUES
-- These posts will use a placeholder user_id - they'll show up when someone signs up with this ID
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Beautiful morning walk with my golden retriever! 🌅', 45, 8, NOW() - INTERVAL '2 hours'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Playtime in the park - so much energy! 🎾', 67, 12, NOW() - INTERVAL '4 hours'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Whiskers found the perfect sunspot ☀️', 34, 6, NOW() - INTERVAL '6 hours'),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'That face when you mention treats! 😸', 89, 18, NOW() - INTERVAL '8 hours'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'f47ac10b-58cc-4372-a567-0e02b2c3d486', 'Cocoa exploring the garden 🌿', 23, 4, NOW() - INTERVAL '10 hours');

-- Add corresponding profiles for these demo users
INSERT INTO profiles (user_id, username, display_name, pet_name, pet_breed, bio, avatar_url) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'fluffy_lover', 'Emma Johnson', 'Fluffy', 'Golden Retriever', 'Dog mom who loves adventures! 🐕', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'),
('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'whiskers_dad', 'Mike Chen', 'Whiskers', 'Maine Coon', 'Cat dad to the fluffiest boy 🐱', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('f47ac10b-58cc-4372-a567-0e02b2c3d486', 'bunny_mama', 'Sarah Williams', 'Cocoa', 'Holland Lop', 'Rabbit parent and garden enthusiast 🐰', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');

-- Add beautiful pet images for these posts
INSERT INTO post_images (post_id, image_url, alt_text, display_order) VALUES
-- Golden Retriever posts
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'Happy Golden Retriever on morning walk', 0),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800', 'Golden Retriever playing with tennis ball in park', 0),

-- Cat posts
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', 'Orange tabby cat enjoying sunlight by window', 0),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800', 'Maine Coon cat with excited expression', 0),

-- Rabbit post
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', 'Cute Holland Lop rabbit in garden setting', 0);

-- Add some sample comments for engagement
INSERT INTO comments (post_id, user_id, content, likes_count) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'What a gorgeous pup! Whiskers would love to meet Fluffy! 😍', 3),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d486', 'Morning walks are the best! Cocoa and I go out early too 🌅', 2),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Fluffy does the exact same thing! Pets love their sunny spots ☀️', 4),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'f47ac10b-58cc-4372-a567-0e02b2c3d486', 'That expression is priceless! 😂', 1),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Such a sweet bunny! Does Cocoa like carrots?', 2);

-- Add some post likes for engagement
INSERT INTO post_likes (post_id, user_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d483'),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d486'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d486'),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'f47ac10b-58cc-4372-a567-0e02b2c3d483');