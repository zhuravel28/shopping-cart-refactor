# Refactoring Journal

## Крок 1: Characterization tests

**Тип:** Characterization tests  
**Причина:** Перед рефакторингом потрібно було зафіксувати поточну поведінку legacy-коду, щоб після змін переконатися, що логіка кошика не зламалась.  
**AI допоміг:** запропонував набір тестів для перевірки порожнього кошика, невалідних товарів, знижок, доставки та збереження замовлення.  
**Моє рішення:** я залишив тести для основної поведінки CartService, бо вони показують, як працював старий код до рефакторингу.  
**Тести:** `tests/characterization/cart.characterization.test.js`  
**Commit:** Initial commit  

## Крок 2: Extract DiscountCalculator

**Тип:** Extract Class  
**Причина:** Логіка розрахунку знижок була всередині CartService, через це клас виконував забагато роботи.  
**AI допоміг:** підказав винести розрахунок знижок в окремий клас.  
**Моє рішення:** я створив клас `DiscountCalculator`, який окремо відповідає за gold, silver та promo-знижку.  
**Тести:** characterization tests + unit tests  
**Commit:** Initial commit  

## Крок 3: Extract ShippingCalculator

**Тип:** Extract Class  
**Причина:** Логіка доставки була змішана з оформленням замовлення.  
**AI допоміг:** запропонував створити окремий клас для доставки.  
**Моє рішення:** я створив `ShippingCalculator`, який рахує доставку по Україні та міжнародну доставку.  
**Тести:** `tests/unit/cart.unit.test.js`  
**Commit:** Initial commit  

## Крок 4: Replace magic numbers

**Тип:** Replace Magic Numbers with Constants  
**Причина:** У коді були захардкоджені числа: 0.25, 0.15, 0.1, 80, 250, 1000.  
**AI допоміг:** підказав замінити ці значення на зрозумілі константи.  
**Моє рішення:** я додав named constants у `DiscountCalculator` та `ShippingCalculator`.  
**Тести:** всі тести проходять  
**Commit:** Initial commit  

## Крок 5: Extract validation methods

**Тип:** Extract Method  
**Причина:** Перевірка кошика та товарів була написана прямо в методі checkout.  
**AI допоміг:** запропонував винести перевірки в окремі методи.  
**Моє рішення:** я створив методи `isValidCart` та `isValidItem`, щоб код став зрозумілішим.  
**Тести:** unit tests для невалідного кошика і товарів  
**Commit:** Initial commit  

## Крок 6: Wrap storage operations

**Тип:** Error Handling  
**Причина:** Операція збереження замовлення могла викликати помилку.  
**AI допоміг:** запропонував обгорнути збереження в try-catch.  
**Моє рішення:** я створив метод `saveOrder`, який повертає true або false залежно від результату збереження.  
**Тести:** додано тест на storage error  
**Commit:** Initial commit  
