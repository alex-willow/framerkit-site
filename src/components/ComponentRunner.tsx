import { useEffect, useRef } from "react";

const ComponentRunner = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sections = [
    { name: "Navbar", href: "/layout/navbar" },
    { name: "Hero", href: "/layout/hero" },
    { name: "Feature", href: "/layout/feature" },
    { name: "Gallery", href: "/layout/gallery" },
    { name: "Testimonial", href: "/layout/testimonial" },
    { name: "Pricing", href: "/layout/pricing" },
    { name: "FAQ", href: "/layout/faq" },
    { name: "CTA", href: "/layout/cta" },
    { name: "Footer", href: "/layout/footer" },
  ];

  const components = [
    { name: "Accordion", href: "/components/accordion" },
    { name: "Accordion Group", href: "/components/accordiongroup" },
    { name: "Avatar", href: "/components/avatar" },
    { name: "Avatar Group", href: "/components/avatargroup" },
    { name: "Badge", href: "/components/badge" },
    { name: "Button", href: "/components/button" },
    { name: "Card", href: "/components/card" },
    { name: "Icon", href: "/components/icon" },
    { name: "Input", href: "/components/input" },
    { name: "Form", href: "/components/form" },
    { name: "Pricing Card", href: "/components/pricingcard" },
    { name: "Rating", href: "/components/rating" },
    { name: "Testimonial Card", href: "/components/testimonialcard" },
  ];

  const topItems = [...sections, ...sections];
  const bottomItems = [...components, ...components];

  // refs для целевой скорости
  const topTargetSpeed = useRef(0.5);
  const bottomTargetSpeed = useRef(0.4);

  const handleMouseEnter = () => {
    topTargetSpeed.current = 0.15;    // замедляем верх
    bottomTargetSpeed.current = 0.1;  // замедляем низ
  };

  const handleMouseLeave = () => {
    topTargetSpeed.current = 0.5;    // возвращаем норму
    bottomTargetSpeed.current = 0.4;
  };

  // Плавная анимация через requestAnimationFrame
  useEffect(() => {
    let topPos = 0;
    let bottomPos = -50;
    let topSpeed = 0.5;
    let bottomSpeed = 0.4;
    let rafId: number;

    const animate = () => {
      if (topRef.current && bottomRef.current) {
        // плавное изменение скорости
        topSpeed += (topTargetSpeed.current - topSpeed) * 0.05;
        bottomSpeed += (bottomTargetSpeed.current - bottomSpeed) * 0.05;

        topPos -= topSpeed;
        bottomPos += bottomSpeed;

        if (topPos <= -topRef.current.scrollWidth / 2) topPos = 0;
        if (bottomPos >= 0) bottomPos = -bottomRef.current.scrollWidth / 2;

        topRef.current.style.transform = `translateX(${topPos}px)`;
        bottomRef.current.style.transform = `translateX(${bottomPos}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="components-runner" className="py-10 sm:py-12">
      {/* Верхний ряд */}
      <div className="runner-container">
        <div className="runner-mask">
          <div
            className="runner-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="runner-content" ref={topRef}>
              {topItems.map((item, i) => (
                <a key={`top-${i}`} href={item.href} className="runner-item">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Отступ между рядами */}
      <div className="runner-gap"></div>

      {/* Нижний ряд */}
      <div className="runner-container">
        <div className="runner-mask">
          <div
            className="runner-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="runner-content" ref={bottomRef}>
              {bottomItems.map((item, i) => (
                <a key={`bottom-${i}`} href={item.href} className="runner-item">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentRunner;
