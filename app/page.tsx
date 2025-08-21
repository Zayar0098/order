"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import ThemeToggle from "@/app/component/ThemeToggle"; 

const MENU_API_URL = "https://jxi38tehw1.microcms.io/api/v1/order";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const router = useRouter();

  useEffect(() => {
    fetch(MENU_API_URL, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setMenu(data.contents));

    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const addToCart = (item: MenuItem) => {
    const updated = [...cart, item];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      {/* Header with dark/light toggle */}
      <header className={styles.header}>
        <h1 className={styles.title}>メニュー一覧</h1>
        <ThemeToggle />
      </header>

      {/* Menu list */}
      <main className={styles.menuList}>
        <ul className={styles.list}>
          {menu.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <div className={styles.ImageContainer}>
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    width={item.image.width}
                    height={item.image.height}
                    className={styles.menuImage}
                  />
                )}
              </div>
              <p className={styles.name}>
                {item.name} — {item.price}円
              </p>
              <button
                className={styles.addButton}
                onClick={() => router.push(`/confirm/${item.id}`)}
              >
                追加
              </button>
              {item.comment && (
                <p className={styles.comment}>{item.comment}</p>
              )}
              <hr className={styles.separator} />
            </li>
          ))}
        </ul>
       
      </main>

      {/* Cart */}
      <aside className={styles.cart}>
        <h2 className={styles.cartTitle}>注文状況</h2>
        {cart.length === 0 ? (
          <p className={styles.empty}>まだ注文はありません。</p>
        ) : (
          cart.map((item, i) => (
            <div key={`${item.id}-${i}`} className={styles.cartItem}>
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  width={60}
                  height={40}
                  className={styles.cartImage}
                />
              )}
              <p className={styles.cartName}>
                {item.name} — {item.price}円
              </p>
            </div>
          ))
        )}
        <div className={styles.cartTotal}>
          合計金額：{totalAmount.toLocaleString()}円(税込)
        </div>
        <button
          className={styles.checkoutButton}
          onClick={() => router.push("/checkout")}
        >
          会計する
        </button>
      </aside>
    </div>
  );
}
