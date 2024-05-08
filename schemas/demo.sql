CREATE TABLE mandis (
    id SERIAL PRIMARY KEY,
    mandi_name VARCHAR(255),
    state VARCHAR(255),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    commodities_traded TEXT[],
    location GEOMETRY(Point, 4326) -- Store latitude and longitude
);
