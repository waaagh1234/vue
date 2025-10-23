Table products {
      id int [pk, increment]
      product_name varchar
      product_desc text
      now_price decimal
      original_price decimal
      sales_count int
      create_time timestamp
      brand varchar
      category varchar
      image_path varchar
      shipping_address varchar
      status varchar
    }

    Table platform_users {
      id int [pk, increment]
      username varchar [unique]
      password varchar
      email varchar [unique]
      create_time timestamp
    }

    Table user_shopping_cart {
      id int [pk, increment]
      user_name varchar
      product_id int
      quantity int
      create_time timestamp
    }

    Table user_favorites {
      id int [pk, increment]
      user_name varchar
      product_id int
      create_time timestamp
    }

    Table user_purchase_records {
      id int [pk, increment]
      user_name varchar
      product_id int
      quantity int
      total_price decimal
      status varchar
      purchase_time timestamp
    }

    Table product_reviews {
      id int [pk, increment]
      user_name varchar
      product_id int
      comment_text text
      rating int
      is_anonymous boolean
      create_time timestamp
    }

    Table merchants {
      id int [pk, increment]
      username varchar [unique]
      password varchar
      email varchar [unique]
    }

    Table merchant_records {
      id int [pk, increment]
      user_name varchar
      product_id int
    }

    Table shipping_info {
      id int [pk, increment]
      order_id varchar
      recipient_name varchar
      phone_number varchar
      address text
      create_time timestamp
    }

    Ref: user_shopping_cart.product_id > products.id
    Ref: user_favorites.product_id > products.id
    Ref: user_purchase_records.product_id > products.id
    Ref: product_reviews.product_id > products.id
    Ref: product_reviews.user_name > platform_users.username
    Ref: merchant_records.product_id > products.idTable products {
      id int [pk, increment]
      product_name varchar
      product_desc text
      now_price decimal
      original_price decimal
      sales_count int
      create_time timestamp
      brand varchar
      category varchar
      image_path varchar
      shipping_address varchar
      status varchar
    }

    Table platform_users {
      id int [pk, increment]
      username varchar [unique]
      password varchar
      email varchar [unique]
      create_time timestamp
    }

    Table user_shopping_cart {
      id int [pk, increment]
      user_name varchar
      product_id int
      quantity int
      create_time timestamp
    }

    Table user_favorites {
      id int [pk, increment]
      user_name varchar
      product_id int
      create_time timestamp
    }

    Table user_purchase_records {
      id int [pk, increment]
      user_name varchar
      product_id int
      quantity int
      total_price decimal
      status varchar
      purchase_time timestamp
    }

    Table product_reviews {
      id int [pk, increment]
      user_name varchar
      product_id int
      comment_text text
      rating int
      is_anonymous boolean
      create_time timestamp
    }

    Table merchants {
      id int [pk, increment]
      username varchar [unique]
      password varchar
      email varchar [unique]
    }

    Table merchant_records {
      id int [pk, increment]
      user_name varchar
      product_id int
    }

    Table shipping_info {
      id int [pk, increment]
      order_id varchar
      recipient_name varchar
      phone_number varchar
      address text
      create_time timestamp
    }

    Ref: user_shopping_cart.product_id > products.id
    Ref: user_favorites.product_id > products.id
    Ref: user_purchase_records.product_id > products.id
    Ref: product_reviews.product_id > products.id
    Ref: product_reviews.user_name > platform_users.username
    Ref: merchant_records.product_id > products.id