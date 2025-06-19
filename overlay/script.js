// Enhanced Bonus Hunt Tracker Calculation
function calculateBonusHunt(startMoney, stopMoney, betSize, bonuses) {
  const totalSpent = startMoney - stopMoney;
  // Calculate average bet from bonuses array
  let averageBet = 0;
  if (bonuses.length) {
    const totalBet = bonuses.reduce((sum, b) => sum + (typeof b.bet === "number" ? b.bet : 0), 0);
    averageBet = totalBet / bonuses.length;
  }
  const breakEvenPerBonus = bonuses.length ? totalSpent / bonuses.length : 0;
  const totalBreakEven = totalSpent;
  const actualReturn = bonuses.reduce((sum, b) => sum + (typeof b.value === "number" ? b.value : 0), 0);
  const profit = actualReturn - totalSpent;
  const profitPercent = totalSpent !== 0 ? (profit / totalSpent) * 100 : 0;
  // BE X calculation: (stopMoney - startMoney) / averageBet
  let beX = 0;
  if (averageBet !== 0) {
    beX = (stopMoney - startMoney) / averageBet;
  }
  return {
    totalSpent,
    averageBet,
    breakEvenPerBonus,
    totalBreakEven,
    actualReturn,
    profit,
    profitPercent: Math.round(profitPercent),
    beX
  };
}

// 🧠 New Bonus Hunt Stats Calculation
function calculateBonusHuntStats(startBalance, openingBalance, bonuses) {
  const bonusesCount = bonuses.length;
  const totalCost = startBalance - openingBalance;
  const totalReturn = bonuses.reduce((sum, b) => sum + (typeof b.result === "number" ? b.result : 0), 0);
  const totalBet = bonuses.reduce((sum, b) => sum + (typeof b.bet === "number" ? b.bet : 0), 0);
  const averageBetSize = bonusesCount ? totalBet / bonusesCount : 0;
  const averageWin = bonusesCount ? totalReturn / bonusesCount : 0;
  const averageX = bonusesCount
    ? bonuses.reduce((sum, b) => sum + (b.bet ? b.result / b.bet : 0), 0) / bonusesCount
    : 0;
  const breakEven = totalCost;
  const breakEvenPerBonus = bonusesCount ? breakEven / bonusesCount : 0;
  const breakEvenX = averageBetSize ? breakEvenPerBonus / averageBetSize : 0;
  const totalProfit = totalReturn - totalCost;
  return {
    bonuses: bonusesCount,
    totalCost,
    totalReturn,
    averageBetSize,
    averageWin,
    averageX,
    breakEven,
    breakEvenPerBonus,
    breakEvenX,
    totalProfit
  };
}

function updateTime() {
  const el = document.getElementById('current-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

document.addEventListener('DOMContentLoaded', () => {
  const bhBtn = document.getElementById('bh-btn');
  const boBtn = document.getElementById('bo-btn');
  const infoPanel = document.querySelector('.info-panel');
  const middlePanel = document.getElementById('middle-panel');
  let panelVisible = false;

  // Helper to update info panel visibility with slide
  function updateInfoPanelVisibility() {
    const bhActive = bhBtn && bhBtn.classList.contains('active');
    const boActive = boBtn && boBtn.classList.contains('active');
    if (infoPanel) {
      if (bhActive || boActive) {
        infoPanel.classList.add('info-panel--visible');
      } else {
        infoPanel.classList.remove('info-panel--visible');
      }
    }
  }

  // Patch BH button logic
  bhBtn.addEventListener('click', () => {
    panelVisible = !panelVisible;
    middlePanel.style.display = panelVisible ? 'flex' : 'none';
    bhBtn.classList.toggle('active', panelVisible);
    // Remove 'active' from all sidebar buttons except BH
    if (panelVisible) {
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        if (btn !== bhBtn) btn.classList.remove('active');
      });
    }
    updateInfoPanelVisibility();
  });

  const adInput = document.getElementById('ad-image-input');
  const adPreview = document.getElementById('ad-image-preview');
  const adLabel = document.querySelector('.ad-upload-label');

  adInput.addEventListener('change', (e) => {
    const file = adInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        adPreview.src = evt.target.result;
        adPreview.style.display = 'block';
        adLabel.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Focus bet size after pressing Enter in slot name
  const slotNameInput = document.getElementById('slot-name-input');
  const betSizeInput = document.getElementById('bet-size-input');
  if (slotNameInput && betSizeInput) {
    slotNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        betSizeInput.focus();
      }
    });
  }

  // Slot image URL button/input toggle
  const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
  const slotImgUrlInput = document.getElementById('slot-img-url-input');
  if (slotImgUrlBtn && slotImgUrlInput) {
    slotImgUrlBtn.addEventListener('click', () => {
      slotImgUrlBtn.style.display = 'none';
      slotImgUrlInput.style.display = 'inline-block';
      slotImgUrlInput.focus();
    });
    slotImgUrlInput.addEventListener('blur', () => {
      slotImgUrlInput.style.display = 'none';
      slotImgUrlBtn.style.display = 'inline-flex';
    });
    slotImgUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        slotImgUrlInput.blur();
      }
    });
  }

  // --- Bonus Opening / BO Button Logic ---
  const bonusOpenBtn = document.getElementById('bonus-opening-btn'); // "Bonus opening" button in BH panel
  const bhPanel = document.getElementById('middle-panel'); // BH panel element

  // Slot image URL (replace with your logic to get the actual image)
  let slotImageUrl = '';
  const slotImgInput = document.getElementById('slot-img-url-input');
  if (slotImgInput) {
    slotImgInput.addEventListener('input', (e) => {
      slotImageUrl = e.target.value;
    });
  }

  // Patch Bonus Opening button in BH panel
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
      // Set BO button as active, BH as inactive
      if (boBtn) boBtn.classList.add('active');
      if (bhBtn) bhBtn.classList.remove('active');
      updateInfoPanelVisibility();
      // --- Ensure slot highlight card updates immediately ---
      setTimeout(updateSlotHighlightCard, 50);
    });
  }

  // Hide info panel by default on load
  if (infoPanel) infoPanel.classList.remove('info-panel--visible');

  // --- Twitch Login/Logout Mockup ---
  // REMOVE Twitch login logic, username span, and related code
  // const twitchLoginBtn = document.getElementById('twitch-login-btn');
  // const twitchUsernameSpan = document.getElementById('twitch-username');
  // function mockTwitchLogin() { ... }
  // if (twitchLoginBtn) { ... }

  // Update Start/Stop Money display in right sidebar
  const startMoneyInput = document.getElementById('start-money-input');
  const stopMoneyInput = document.getElementById('stop-money-input');
  const startMoneyDisplay = document.getElementById('start-money-display');
  const stopMoneyDisplay = document.getElementById('stop-money-display');
  const startMoneyDisplayMain = document.getElementById('start-money-display-main');
  const stopMoneyDisplayMain = document.getElementById('stop-money-display-main');

  function updateStartMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (startMoneyDisplay) startMoneyDisplay.textContent = formatted;
    if (startMoneyDisplayMain) startMoneyDisplayMain.textContent = formatted;
  }
  function updateStopMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (stopMoneyDisplay) stopMoneyDisplay.textContent = formatted;
    if (stopMoneyDisplayMain) stopMoneyDisplayMain.textContent = formatted;
  }

  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', () => {
      updateStartMoneyDisplays(startMoneyInput.value);
    });
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', () => {
      updateStopMoneyDisplays(stopMoneyInput.value);
    });
  }

  // --- Slot Database ---
  const slotDatabase = [
    
  { name: "Gates of Hades", image: "https://mediumrare.imgix.net/60206bb76f8d15dd2975ea5d5c908194c66a1183683e6988c83027ada9befbef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Super Scatter", image: "https://mediumrare.imgix.net/7d4fc189e6c48fd611846d6af0d1bd553fa0b9a2481fdeac29e05d864c36b82d?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Xmas 1000", image: "https://mediumrare.imgix.net/206a059864461c5bb63e1af83d5a105a2c36205cb8e01b37418f57d10d295252?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus 1000™", image: "https://mediumrare.imgix.net/8421465d345dc9f775ee55001e0337b80d86dd77f2de36e4cb3650a364210847?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Valhalla™", image: "https://www.pragmaticplay.com/wp-content/uploads/2022/01/Gate_Of_Valhalla_EN_339x180.png", provider: "Pragmatic Play" },
  { name: "Gates of Olympus™", image: "https://mediumrare.imgix.net/eb7ea358dba2cf7967e42f9c8327eb787dd9530d74b8cbdbfcecff9ccc962228?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Aztec", image: "https://mediumrare.imgix.net/0cbe57e4da0fb8361c4b1d40efe87044b47ddd24a577612a488eb3c79e0be455?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Gatotkaca", image: "https://mediumrare.imgix.net/0af25fe25fdd694509af52a1fb2bb725786d01bceda536f99ef549f0f1ea5967?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Dice", image: "https://mediumrare.imgix.net/9099ceb273c85a32737b1682ffefccb899a428ae16daadccf9b7cde80387ad52?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza", image: "https://mediumrare.imgix.net/f95b3adf9d28d57496dd8da909c0cb97515104194924c5abb4cc9ad792f35dfe?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza 1000", image: "https://mediumrare.imgix.net/445d5df4246639bd20337a70ee328301f1d949f4d3c2bc60c9bd7a31fd3636de?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Kingdom", image: "https://mediumrare.imgix.net/be8b9d3bb6565afd24db1b5418a3d235297dbaca52fc64c6affdbe98e5ae02e2?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza Dice", image: "https://mediumrare.imgix.net/d99d991fe476413c9ab9143c19e6add2761d182bfe3e05aad12fbd84da116cb4?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza Xmas", image: "https://mediumrare.imgix.net/07a13b91c0901e1d32ac71918f280ae48acbb684a651d08deef253812fca29ce?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Powernudge", image: "https://mediumrare.imgix.net/6f48e15d310da3000f6554aad1298b424acd06f8544c64ed68c484fbeafc6980?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 100", image: "https://mediumrare.imgix.net/7baf7257bf20524a6e25760fe034bbd129797f8ff2905ab22c5adc0c740319c6?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Rush Megaways", image: "https://mediumrare.imgix.net/9b4094155be45b4ad24cde1c86ce6aae384309f308da2190b61d0baa4f605446?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Gummmy", image: "https://mediumrare.imgix.net/ba614293c3ec7b1d3037a7211c7063e27ef4ef53ea75e45b4be03ea9bc764d9e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy", image: "https://mediumrare.imgix.net/1f358762243f6f9201258778752a0a0c64d820bef568dad2e6737f6dd4109f65?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 2", image: "https://mediumrare.imgix.net/cc54de090e5d4949aa9cd9286e554a0ea678f87b19b314daec29988ab9501ef1?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush", image: "https://mediumrare.imgix.net/d460898300e27164e6a059a28fca4b38582c07701a7298566ac08661c8b7dc58?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush 1000", image: "https://mediumrare.imgix.net/14d5410c6cf4c303d291262a10e949dc14b0ac2eca2a7a730b0401919c01358e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush Xmas", image: "https://mediumrare.imgix.net/0e621a565ef413c50798294d014cb1e96550effe8ab5befcd1d6774d9dc20148?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush Dice", image: "https://mediumrare.imgix.net/1dfa0e762f74219c3cdfe56428fed3130191f4ef289d1e7f5b116023a6d1e450?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Supreme Powernudge", image: "https://mediumrare.imgix.net/fc3a732b64a73b0011a0e55def22bb91de90bddf3637f5aad383fd30e47b1fa8?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Twist", image: "https://mediumrare.imgix.net/3fbda3cb3022ebe5175f345c8bd6ff4b3cc305f28b2b10c21b5762f788908623?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Rad Max", image: "https://mediumrare.imgix.net/912e93fcb0e5f52ee1f549d6b6ffcf21ba0847eef9c5003a28893274a6f1cb68?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pray For Three", image: "https://mediumrare.imgix.net/1ea39d28bbd9237c659f60233fce9bdd9f1c46b934c5d3b311f1580dbcea7f74?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Duel at Dawn", image: "https://mediumrare.imgix.net/81223334b34083d375cd42c6df9f0a5414b817e8ca16b54dc3b63e05386fc44c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wanted Dead or Wild", image: "https://mediumrare.imgix.net/2c04ff5694af0adf12b483a79567814407c1a4fc943b4d1980f84367a1910874?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Danny Dollar", image: "https://mediumrare.imgix.net/21e4b0ac5fd88338625abc758802e7f90156ae5cecf25ac236cd1a03fc0a693e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "SixSixSix", image: "https://mediumrare.imgix.net/30be38fdc2b4d9a6c76194314dfb7814a66d6905287ade354a0e5f2a79b1ab27?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Life and Death", image: "https://mediumrare.imgix.net/9407302fecd33613bc716d3b0d4f1e724334321ec910404f6b417284db593d37?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Viking", image: "https://mediumrare.imgix.net/2cb39e9486a6cd37f49767537241fc8b9f5fd302f17a79c06f5220afcea27ea3?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Pharaoh", image: "https://mediumrare.imgix.net/293b2337d4d5cfda999ca423e34518a1a6682062340f1f1c5a669a26e7927c79?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Bandit", image: "https://mediumrare.imgix.net/8ade942d35d2cdbddf7888f303be4cf4bda8c650a112b3c53f7c6f3ccad81254?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Spinman", image: "https://mediumrare.imgix.net/fcc00223f58811594d5c7db35abd3e2f1aeac13866981132e044333c75a4a3bf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Reign of Rome", image: "https://mediumrare.imgix.net/7c2dd8e10ca25f28737a4cc48c50b4b898c15b633ee14459b956237f2e58e185?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "FRKN Bananas", image: "https://mediumrare.imgix.net/d4c903b8aa3bcbcd3e7cfdd46e14fa5ff3f056922cd470a109438ee41184990e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rip City", image: "https://mediumrare.imgix.net/c55c2ec37c310140617b75c9e490faca98090292991840dce959d93649efbfa5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fighter Pit", image: "https://mediumrare.imgix.net/5ec25f926e0d9b8b6575aa93df1dfb769e7b6b2127f801d159994eb249eefe29?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wishbringer", image: "https://mediumrare.imgix.net/6bddae78f98ce6fc8d84be9b084d070cb755c3cb86b8ec05000f8af742536b66?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Slayers INC", image: "https://mediumrare.imgix.net/f08dd3c03232627f508e0b4f458651947e13e46f6d8a53be08507672256d3be2?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Donny Dough", image: "https://mediumrare.imgix.net/d0da486c2ef84196c52198fce55b4566303ef3d73d94c675179a8f6c4c5a3781?w=180&h=236&fit=min&auto=format ", provider: "Hacksaw" },
  { name: "Magic Piggy", image: "https://mediumrare.imgix.net/b18560b8631fc3b27c06d41e9729f7774048864ad7c4a16d1a20b1a953883943?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dork Unit", image: "https://mediumrare.imgix.net/33cd5a34c3937da326652a3beb44fe9c3680118c363a060ca5670847595561a5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chaos Crew 2", image: "https://mediumrare.imgix.net/9d93c95c411dde57286a1ebb9dc76d93ab8f0c49d1b1445ce7d316c36820552c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hounds of Hell", image: "https://mediumrare.imgix.net/05830ae2a958fe4b3d1c334ef2e93c34406fde0f9402969ef3a4d26992024e9d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Klowns", image: "https://mediumrare.imgix.net/075588ccb0fe1466d036afcd2386e173af3032773c0ed4e1c4b02b60ab630691?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hand of Anubis", image: "https://mediumrare.imgix.net/6d3e8501656c2ae403f7478d9bee1ffb49f81894b8f45ca42ad457a834a79149?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Thai The Toad", image: "https://mediumrare.imgix.net/715d1e5694973e27bac8deb3fd4c375135ca01517822bf3ab7a31888f7646119?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fist of Destruction", image: "https://mediumrare.imgix.net/c123ef1cf5a97e2c94cdbd6db80c47c35afa5af9837f1416eb25ac10dd6c8f50?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rotten", image: "https://mediumrare.imgix.net/da1d839ace20adb0337eae0b922a336d54df21aa2d8d616aad9f234a2ca38f90?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ze Zeus", image: "https://mediumrare.imgix.net/e20cf100fe7b8cc8f19a428ca222abd4f85c46679f876aa08fa2521248360b54?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cloud Princess", image: "https://mediumrare.imgix.net/c0be957b99d1a534b8fa221a225e87445766948f0b861b42700ad370fb84e22d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stack´em", image: "https://mediumrare.imgix.net/894ab0aba513722d8da9f3b118fb1197a00b248e40214b196fa7701265934069?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Miami Multiplier", image: "https://mediumrare.imgix.net/fdd4a97ee86f946b11c92f897c55696bfaabbd97002727c9d91b3c8883c31733?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Marlin Masters", image: "https://mediumrare.imgix.net/1b0d34ebc41450aedeb0720079aa82a9625da940ec61fbe2ef2b51f5a8b6d04b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Xmas Drop", image: "https://mediumrare.imgix.net/be3cf80fcd859427ca4ecabef13e7dfbee3603eaa3ed2dc975ccc1cb6ee622dc?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dorks of the Deep", image: "https://mediumrare.imgix.net/73558636b4e41b610e1e15aa8f527b84348895dbbfee8f02d1231af77abbe9b1?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stormforged", image: "https://mediumrare.imgix.net/35e02b639347011bbf26252e562f1535447edd5db692c212a0469c4ad5da512c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "2Wild 2Die", image: "https://mediumrare.imgix.net/cca5a281205cfcc8161b358091cc19e7af1385127754d005d4ddb12b8e9e2ba9?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Benny the Beer", image: "https://mediumrare.imgix.net/4ae57eafffc4f3253232b04ef6d9948eea70ef01d0337c56e106c773e92bc509?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fire My Laser", image: "https://mediumrare.imgix.net/7a29a0822d23020cd983ede3c4af9a90f065512b1cecd10d6faee751107a3bbf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Double Rainbow", image: "https://mediumrare.imgix.net/f2cea670f01b8351d7660385c688a0d30d5da4f201fd478df5d26ec9e78ce460?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Octo Attack", image: "https://mediumrare.imgix.net/9e3f45cf9ef13c45d0aa67f7c2e9ce49187e196db7d3e1c862427f72b7f121ff?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Phoenix Duelreels", image: "https://mediumrare.imgix.net/7ac7169ca980177d2f7843face3046fb42c001bf4dd7356becb037e92fc07ff1?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Densho", image: "https://mediumrare.imgix.net/eadeb726f36d9807051b6216e638c817537c8b4a39cd1e5de9017e1b0d6ea61c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Beam Boys", image: "https://mediumrare.imgix.net/d0d102db575ee3a3b89ae2a12ff27799ee95063fb1e97ae2c616b2fba5727bcd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Beast Below", image: "https://mediumrare.imgix.net/fad562df401ccfd1dde3707308efab027eea94a6cd11c35d64cc814efbb3a44f?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Drop´em", image: "https://mediumrare.imgix.net/dd4726f7b3ab5614e1e56c8314748397dc45f1d2a60d1a83a935a1fac95936a4?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Strength of Hercules", image: "https://mediumrare.imgix.net/92dc6be959aee15f956fd64e6fd3777274d9655724912343ec222235858e1fea?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Donut Division", image: "https://mediumrare.imgix.net/694d00465a62a9aa16b08c0739945ac27d025ca0f7e3ccbbf165f325b1ca87af?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Eye of the Panda", image: "https://mediumrare.imgix.net/740e91df538e182d4a8ceb6ada7a928a9cfd077796b52dd62b676bbb87a92575?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shaolin Master", image: "https://mediumrare.imgix.net/bff4a442bf939fb6e8d113fa34c1bfe514b520f5d27cc157ea4a9c1c48a3f53b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chaos Crew", image: "https://mediumrare.imgix.net/bececcbc4d481dfd6a4fd61f9263dc4bc28d319e93f4ff3fb04cd6c73b0e9ca7?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cursed Seas", image: "https://mediumrare.imgix.net/8a9907240271fd24b09f8c40964e3e7726e056302456e029ee25cf4aa5eb7f74?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Toshi Video Club", image: "https://mediumrare.imgix.net/4580fbe00b06937db40d6759fa65a17337e3c01b96d40d2333739b407be6781b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Crew", image: "https://mediumrare.imgix.net/66c02d382f74c7188da5306983f78f42d6aade7b388b8c149c3ac20117d69887?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pug Life", image: "https://mediumrare.imgix.net/7b18b96de662a92729c3aa7722f6bf872305f9a9d07a60c99ee3f23fc0198f6?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Joker Bombs", image: "https://mediumrare.imgix.net/6afdddc8fdfca2d0106bdaf4e8f02b6c1fbe455df3b855bc6babf6e0669dcee9?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "King Carrot", image: "https://mediumrare.imgix.net/9f7dd8932657e921d74bad8c9355fe6464e64dae26e373c87b554bb62c2e25b8?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Twisted Lab", image: "https://mediumrare.imgix.net/0ed46be36a9207f44ba20b50629d630446504a05db3c513a4b2e1e4abfeb5baf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Evil Eyes", image: "https://mediumrare.imgix.net/433a1bbc729168261fdc1af5d2047264768654851712d76ae933bcc84f3d5146?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Vending", image: "https://mediumrare.imgix.net/fa74f56742f954b651a006b25c87cf21717541033fbb435a53a10ac675ca2519?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mayan Stackways", image: "https://mediumrare.imgix.net/f13df3ab6dbb6f1bc732baa75113414ecc4aa04d1860bb009cc8aba4717f2f64?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rusty & Curly", image: "https://mediumrare.imgix.net/4fbce82073cab8684794cfb36eabd2cec98a0f7df2340a9ac0b308e0aee25ac7?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Itero", image: "https://mediumrare.imgix.net/34c5240f711e56c6af514136ff142cad4b39fd4c9aa3869b627ec010e6da559b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Get the Cheese", image: "https://mediumrare.imgix.net/ba6e2fa2799f1f9926bd2d79e2aa175669ea86116c4dc1e530893cfc68d0a57e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wings of Horus", image: "https://mediumrare.imgix.net/506275b06b8a03b332c806dfffd1599f32c68b5674f112cdd04802470a968f7c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rise of Ymir", image: "https://mediumrare.imgix.net/63ecb7db83f55f800b6c3c057c13f8a80185d4b767500b264867ae07aeb10845?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Immortal Desire", image: "https://mediumrare.imgix.net/1a7de51973e9c1298b1fa58ffe6bdd9ddb02c9e2df2c1adf62c7ca4b63c0b06a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dragons Domain", image: "https://mediumrare.imgix.net/b32ecba95ce52b451ff09fba9f89246ef4051abac52d250094627f0c5ef6c3e5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Book of Time", image: "https://mediumrare.imgix.net/9bf10cb05301c16c0fb09d93ba8a973b834fbf76b5a37676878302e9c0e1d3d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Bouncy Bombs", image: "https://mediumrare.imgix.net/7f74559ba42c4b965d3f9809a77fbf366af4778bea4af823c9d661abe55302db?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Snow Slingers", image: "https://mediumrare.imgix.net/9048c86fad269aa7ff0abf63ee8c2ddc96f0bf4d5ae519231d40d85a65389986?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cubes 2", image: "https://mediumrare.imgix.net/017cf6597dff23e99f30b296c4162018320b4c6d4e0843b4e8c1d06e45827547?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gladiator Legends", image: "https://mediumrare.imgix.net/370c9ad85d5a47352f86357e6eec9bc13910b6b77985eb5ef1139cb39680c62b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Outlaws INC", image: "https://mediumrare.imgix.net/1df63aaf3942d0e8423a0343adfaeba4976c44e5ca7c2dddabeb7863fca63a94?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Buffalo Stack´N´sync", image: "https://mediumrare.imgix.net/5ca299b61c3c24a3f3c241360bb74cc7970f3b63cf5d2d9f9cdf2de854e06e97?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Bowery Boys", image: "https://mediumrare.imgix.net/153706d7dcb82fbf41e255df6f173ca042c6876bf1a25bdad3b5a669559c965c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dark Summoning", image: "https://mediumrare.imgix.net/7184d134ae7499ad10ffe6f985c3e0906bc2ab99518c182f7f53c08a260f095a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Undead Fortune", image: "https://mediumrare.imgix.net/86eab2d535cb53548f1a5aeacb04b08f9ee029905a7c658370d11aa14b17e3c3?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Frank´s Farm", image: "https://mediumrare.imgix.net/8493bbf7575c02b09d053ec3034532f6dec87301495fa5b0cdcd0a5cd297eeeb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fear the Dark", image: "https://mediumrare.imgix.net/62a6617f773bae2bf5e42516d725c4a00de48ecc4091fd37f4c897fe4d45be31?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gronk´s Gems", image: "https://mediumrare.imgix.net/0cfe7d7f16134b507f5f44d1cc74c885fc68ca6375147f31d3ba6b05ae9636cb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Divine Drop", image: "https://mediumrare.imgix.net/2e7edd753384f73be3253d4e68eb4c66319ec1161ef9c769dfbe6676ed67ca46?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Born Wild", image: "https://mediumrare.imgix.net/42393b8f277ee62dc05f00ed9b135e4fe7c1cfb9c8f95a44057a2ccead764e96?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cursed Crypt", image: "https://mediumrare.imgix.net/a3d5a4916410d4a5c0f0ce0e41180e388487c53fe106c454096bfd3fab821a66?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Keep´em", image: "https://mediumrare.imgix.net/b1b7c5f14a4f446855ca34c21ca56235a8e74ed1fd948eaccc81687367488216?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Alpha Eagle", image: "https://mediumrare.imgix.net/4824466ee7f5ebedde11e4a312cca6678d4f8b0f4ed004980fd15ff25dd9d1d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ronin Stackways", image: "https://mediumrare.imgix.net/68a04cf0d75f6fd3c1884805806e11ad128f09a8d274574ec99f34cd8f46f76e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Aztec Twist", image: "https://mediumrare.imgix.net/a033b9e2336fdd9ef2204f159b98577dcec061c1cea5841685521a165a64ff1c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Xpander", image: "https://mediumrare.imgix.net/0ff16310e6d71b703046e87e30d66ce1a1b026316c24cc034e7731d04633d743?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Time Spinners", image: "https://mediumrare.imgix.net/ba3b2a5e0c0723860fa088fdcfa8216dec4d5023e6b9f291df95bfebc75ba223?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Temple of Torment", image: "https://mediumrare.imgix.net/7bf6165ab400a926c5abe6ec72a0bb755f637fcdbf0773e1f85f6607f5ac2502?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Break Bones", image: "https://mediumrare.imgix.net/c7e0eca2babf18eb00364a38d18f5e3cba868c9ff2480a98bbbf5a5ef203f1be?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Bloodthirst", image: "https://mediumrare.imgix.net/7bcad426782c83c08801d657c44cfb1afb5789c867bb21c01acc058af27e4cb6?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rocket Reels", image: "https://mediumrare.imgix.net/7f73d6b27bf2af6b867937e9eb31617b6ff801f09135daf10c5d3d0da2d98b4b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Compass", image: "https://mediumrare.imgix.net/e2d08a4aeb8dc9aa5e076e4ec5e6f29217c0c963fd281059b1b2f401554fc2bc?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Warrior Ways", image: "https://mediumrare.imgix.net/7ad19594cf9ddfeb442c6cf1217e50f5a0586afebbebc5107c15a4f90080657b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hop´N´Pop", image: "https://mediumrare.imgix.net/6605d3de0dd8b58b00db3054ab39e3c68d43cbccfd83ff50a13ade8fb5f21d31?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Orb of Destiny", image: "https://mediumrare.imgix.net/f79b83bc1408abd366a916e4e3b401dd76eb2a0cd31528067fcdb9072d5f7b1d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fruit Duel", image: "https://mediumrare.imgix.net/a188243dfba1a1bbc9eb9609c250693ecd3643cb57b1bb0adba320dd054edc77?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mighty Masks", image: "https://mediumrare.imgix.net/414115bbf7390de09bc1f349630e14b6b3e17b606ea18b3fb5d5ceebae601173?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Feel the Beat", image: "https://mediumrare.imgix.net/177e1af21ec99124784e606594f8447933ead39c3262eb50a8041f8adce28853?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Bomb", image: "https://mediumrare.imgix.net/12c3bb0487e2239772248e61550a121ee20fe8400a63f386d08896d1122d1655?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Haunted Circus", image: "https://mediumrare.imgix.net/b249d80cd1bb7367d3e9fe9062c04c28563a3050c3f4893b57392e3e132938fa?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mystery Motel", image: "https://mediumrare.imgix.net/9bb69ef1c5050873ce837473559ecfc7774d4f8ecc23c4e109ca441b12bdc523?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Keep´em Cool", image: "https://mediumrare.imgix.net/3d07ee2ca280623bb86771d146352267affb73d70dc878750fea88e62eb40553?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dawn of Kings", image: "https://mediumrare.imgix.net/ee600c4d3d4145ef3d2501749e4f2872a68cdc47ef2dc17af43ac6a24b1eab1d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stick´em", image: "https://mediumrare.imgix.net/aa91b1aaf297b3c8f174c6364731135f14b55bdd47c60e9ccc1ccd8ef69f3959?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Quest", image: "https://mediumrare.imgix.net/96ab764e436daa2fb926d719ed3e6bda0c8f0f42a3d08f4bc4854c0d7a4ea0d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Jelly Slice", image: "https://mediumrare.imgix.net/9bcfcbf49d9b6184dec0dddd43d88e4ff7cacffd1c65c4202b03178bb4ae43ad?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Forest Fortune", image: "https://mediumrare.imgix.net/ad803f6a41eaf29721af391695c25656941eae8d3e1ab5ceb1dd692fd6b3586b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Om NOM", image: "https://mediumrare.imgix.net/8cf1f4ee0df6994bbdadd377285357b241a51dd22b3e2fdf3bf6252e9816f479?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Respinners", image: "https://mediumrare.imgix.net/68f2388cb67b4cd35de210c31f5ca15bbe7f3e904e26a50a63315a4d2568f1eb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Frutz", image: "https://mediumrare.imgix.net/b5d02c384a3e96a30e90018887f14d0923a2c05e582abd4cfa18fd600d7fa94e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cubes", image: "https://mediumrare.imgix.net/cf92f60f919b018998478dd92fe93193ab77cdce4bdd5b2ca826dd9b0a38055a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Tasty Treats", image: "https://mediumrare.imgix.net/a478052cb3a60aacfdcc4dacea3d0b4ea0a095c28e55ccabafd0b64f3c4fb9bf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Let it Snow", image: "https://mediumrare.imgix.net/22d5ab5f65de364fd4573409289caffbf7cd4c1696ffdc8cbb6e0c0f5ca2aaff?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Harvest Wilds", image: "https://mediumrare.imgix.net/cc2173ba768f9fa72a884bb8d475c47ab13d44b25a275972255ee4fd85331a99?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ethenal Nile", image: "https://mediumrare.imgix.net/8621688f67c74a42471c052dcc3443c754617d159258554125da3dc1e1da470f?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "8-Bit Quest", image: "https://mediumrare.imgix.net/c24f8c668823b8fc9ecaace4ec2d458d28106c6247b4138a561d38db6b705455?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Monkey Frenzy", image: "https://mediumrare.imgix.net/0b60d8d6e4080095e0cb2e7efd68436ec285135fc00ae0bced559815ffcac7bd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Sticky Candyland", image: "https://mediumrare.imgix.net/01d620d4903a3f14b397ef202e934cd4e9902ad01794e7bc20903fe156a2a5b4?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Library", image: "https://mediumrare.imgix.net/66dd42db2459d2b0a8fc356ed18ad0b3489b562ba80446496c4a8fa908c134cd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shadow Treasure", image: "https://mediumrare.imgix.net/04531340b93a65869cd94e56b921bb3438909d61336954c94f7824f8266b1f03?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Lucky Multifruit", image: "https://mediumrare.imgix.net/07dfe0313bf45e0d937f277cbf11f9b2181520f2c0c2a01e4b7d539365e6bd18?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Duck Hunters", image: "https://mediumrare.imgix.net/34ee5a63f09ad96cd4d92ba752de18ca210df5439723203c26f385bed7ee97f1?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kill Em All", image: "https://mediumrare.imgix.net/46ba3573140d67ff2eec9e1c06b37518622d5135bc7abbb590f432a428980267?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Highway To Hell", image: "https://mediumrare.imgix.net/580786a24cdc3f5473c5f00ed5566b58b8b375de32a03284c80f9025d455bd50?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Mental 2", image: "https://mediumrare.imgix.net/3ca0964f7fb9827c900be70a2a0e23005f2b0e4aa67b57365336766c27a7cf40?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Outsourced", image: "https://mediumrare.imgix.net/21f2d81592cc36a42d90f4be5b501f1ef6490c5d0528577aedf76417a25d7fa2?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dead, Dead Or Deader", image: "https://mediumrare.imgix.net/fc101acdf7ca30e3e78e78e853aa11d9ac0159ef88062ffc72408637de549d47?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood Diamond", image: "https://mediumrare.imgix.net/8eba0badef103f9a7179f2f5cc7b8f091bda4f3adb873ac15d28f0dddb5952e0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Nine to Five", image: "https://mediumrare.imgix.net/c06ffbd9ac77f592824e0393517914beab310640bcba1cca51731c141d8fa566?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "San Quentin 2 Death Row", image: "https://mediumrare.imgix.net/bbbeff94e0b2956633a6a1700e38f39450696673391fb991f8c96d3c5c86157a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Fire In The Hole 2", image: "https://mediumrare.imgix.net/d93aa56548ee2716b2e743e2b6a0d04a4bcbe6507964367d50c3529ab886ac85?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Brute Force", image: "https://mediumrare.imgix.net/2bf6daf687390406257eb7a19c6789bd363a455aeb155955fda5030644e5d431?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Xways Hoarder Xsplit", image: "https://mediumrare.imgix.net/626864b91465700ae03a98e2f4254b6461b97906c0daa572b3bca4e103c0a745?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Book Of Shadows", image: "https://mediumrare.imgix.net/2c68bb24ec9e031476516000d76f563ecb8f7197b63eae6aed241245f7dcc515?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone Slaughter  El Gordo Revenge", image: "https://mediumrare.imgix.net/dc6e003dcb26eb6adc4499660abeac536f11101fc62b79cdd28931109fc9a376?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Mental", image: "https://mediumrare.imgix.net/e96a6381078a53449a8ca14f35786f2afe5c0007254bc2053bc1e9ba2a0715eb?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Home Of The Brave", image: "https://mediumrare.imgix.net/0bc0abf755f1e81014bb1e0204d6e0339663ed88c20ef9a2228860d82bf45525?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Crypt", image: "https://mediumrare.imgix.net/3285df789ee1e5f52e3b075b4eb0c1f080fcdce28f7c9689daa4e62f87fa85a3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "DAS XBOOT", image: "https://mediumrare.imgix.net/822438dc4259368302ef5ec6345c4c21a73097e4265f21f53008cef1e79f6cd0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Brick Snake 2000", image: "https://mediumrare.imgix.net/904a92d026b8583a219d86f3aecaf739b72a7313ece71b6aafdac3c179a5b4ec?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kenneth Must Die", image: "https://mediumrare.imgix.net/355d623ff7dcacebbdde1aec5ea2cf741935bee9d9eff8eea83c78590f22690b?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Loner", image: "https://mediumrare.imgix.net/c4b68434aa2e8f5ce669b670f3a99b8fb0550fefd2390ae0f9aa14ff5f8a209c?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Devil´s Crossroad", image: "https://mediumrare.imgix.net/686f4b4366094b5f4ce040c7468125b4b18e7764c982237af9d1c79c645839c6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Road Rage", image: "https://mediumrare.imgix.net/fd404858468d9f561073b9dde3bcb7cdd5a3d9e22ae1e47f97781a86535fa55a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone Rip", image: "https://mediumrare.imgix.net/79241625ea0d952c1ca3fe1b5fe1c50b408c1d35beb7096dee3e40858b8ce3c6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Karen Maneater", image: "https://mediumrare.imgix.net/9dea511342cc56765b3569497ba3b21d4acc46f8d9c79bac96c79dc4bdf8ce22?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Deadwood R.I.P", image: "https://mediumrare.imgix.net/950a8d14e60169197cb5b26dcaebf4aff9375eb99eb5647c72d455f2ceb52948?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Apocalypse", image: "https://mediumrare.imgix.net/2cb50b6da92786adf437bf9f7c7d3976608f0a4db302446cf2edf1ac8d62fa1d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Rocker 2", image: "https://mediumrare.imgix.net/ed445ad8db1ce3aa5bc3de4abcf815fcc56d2b77fbdf721d75527ffef10f04dc?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Infectious 5 Xways", image: "https://mediumrare.imgix.net/3a867a309eb8fddad57081585b8e6d2761f40a0bed4c0390baa36a355135bd00?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Folsom Prison", image: "https://mediumrare.imgix.net/7302b9247bbb9187df5ba750f1afd2d07f9ef093bb5fcc9aac8b23854f59adde?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood And Shadow 2", image: "https://mediumrare.imgix.net/c938eba95cc562f4976a5e87cbcc5293b7b4a9d294f85465dd0b05e0d6242f3b?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Misery Mining", image: "https://mediumrare.imgix.net/52ec64ba09cf9dd206cbdd1e66b6b5abd8052c601fe425c7a95901e88012bf37?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Buffalo Hunter", image: "https://mediumrare.imgix.net/66a79f68725b5d3fb1e940922a2562a3500f3daac56a9d056b00ce9b5a839a71?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Fire In The Hole Xbomb", image: "https://mediumrare.imgix.net/1c880d29afe39363c2b912fa1f90097eee2d39219a3dc3c224678f4dd520fce3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tractor Beam", image: "https://mediumrare.imgix.net/7222443c7b5d9b96d4dea8b1090470defaaeb7e78de9d5c4ef0bb981a3ea4bdf?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Pearl Harbor", image: "https://mediumrare.imgix.net/cd746fb8aa1bfe6e90ecd47b3d420938d7058fa1c97fb43330b65b70ba986c35?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "D-Day", image: "https://mediumrare.imgix.net/5034da0890a57d6de36866165567e60c21d55a123ce8b90f953fa806095879d4?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "San Quentin", image: "https://mediumrare.imgix.net/ca243d6c3db42259d6859b80717eb378eb64e41a9d1b1f7fdeadde68d59d9ad5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Land Of The Free", image: "https://mediumrare.imgix.net/6128e2d70db29bfcfe14269b652524ee51b931dae9f11469a74c14be004cc879?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Warrior Graveyard Xnudge", image: "https://mediumrare.imgix.net/db4e73c4812e1ede12d2f34ce9a07dbe7ac1a02d6585510eb5e04ff439ab3f71?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Deadwood", image: "https://mediumrare.imgix.net/624759841db8d261bbc83b9bbb8111d40b95ee4d9c025ca7d364e0fbac410ba0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Eas Coast VS West Coast", image: "https://mediumrare.imgix.net/f32b71c88d0fb3be4b93c136af771aadba05871986136b73e75622b1e8f30700?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Disturbed", image: "https://mediumrare.imgix.net/8b474e497d0ea0109e222b226456da1828913a605890a82dc4bb42d439fa05a6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Serial", image: "https://mediumrare.imgix.net/07567162f12d9e51847089c49f835445527e03a2d0fc17d7d1c770a69c1dc74e?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Ugliest Catch", image: "https://mediumrare.imgix.net/00fce06cc9f7bb26a217180b623b889df1e9e3c320d34156cdaa78ccf0138595?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Stockholm Syndrome", image: "https://mediumrare.imgix.net/0b1a1fb092eecde4752edbbdae134e7a4eca6235787211d5dd2435fbaf3e8f45?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Beheaded", image: "https://mediumrare.imgix.net/830c55f0c73ea21aaeff830abe90d0a5cd2f403503b900b5e2aa72129b421769?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Remember Gulag", image: "https://mediumrare.imgix.net/8744b8f4130b95ed84a3bf7e8a59cf35cf01a8ecf2b74818f9beb0d599eaab39?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Jingle Bals", image: "https://mediumrare.imgix.net/c3453f1b5a16b59fb682d55c8e75d542b0b6763d383a47c5d5c24d7f03e53f30?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bonus Bunnies", image: "https://mediumrare.imgix.net/80f2d2c4447e6e06d95b9af7f94165f577d74b78f24b25d753b5954fb0941f83?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dead Canary", image: "https://mediumrare.imgix.net/7c5ca2b52a1298a4592a9650830d68e67aff4a10408a15d465bb8426cb78fc82?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bushido", image: "https://mediumrare.imgix.net/256162271648c5c96d48e317c4760d7fd1853809e986dfbff8bd54d31cf20559?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Evil Goblins", image: "https://mediumrare.imgix.net/316bbcb1821c748b04fb87e64b194f9c155cd690ee307ec34a4392094e940826?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "El Paso Gunfight", image: "https://mediumrare.imgix.net/77cc160d9914ddcce1dfa45afc5d14f0102fa155b1bdd4b7433ad1a5b0f9a782?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Benji Killed in Vegas", image: "https://mediumrare.imgix.net/e0c840c69bbe217171b51fd911a7d633eebe0a1102b6d96fce9c63d6585ece05?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Monkey`s Gold", image: "https://mediumrare.imgix.net/fa869ff59279fa8a9095fee189e02f5db17f6039d7d9b791765d1c195b1d5ce0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Thor Hammer Time", image: "https://mediumrare.imgix.net/5885b413efcf20331294f32e6abd70849cee0cbb75c19207686834960b7a7d7f?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone", image: "https://mediumrare.imgix.net/01148bdb8a08eae2e8817514ddb68fe6eeb3427390b00cb319e047ae4b1cd766?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Possessed", image: "https://mediumrare.imgix.net/68002032e338e4512a2194d9030b881cf751bed957fa5e3e04c07d81b94e962d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Space Donkey", image: "https://mediumrare.imgix.net/eebe8afe073a7327804cd10f8f8be06c95e70479723fd6ab71b554354817f9b1?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Rave", image: "https://mediumrare.imgix.net/8f0d64d9be52111d617021b56f7fc822a898fe72ddae05df93d9e6926a942a54?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone No Mercy", image: "https://mediumrare.imgix.net/a8d6291dc467a3b9d33e3a0d85e6a364d1dcc777daaba11cd8c1a4289e177ca3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Roadkill", image: "https://mediumrare.imgix.net/ac312a93e3011a33f9b2886df8eaf88ba8d17d6e06714e5292306fd31122ce9a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Toilet", image: "https://mediumrare.imgix.net/b7e23fd8bc2e4047abe21b26be8903a52aa0f11b0fef315d7cd9695dde5f2276?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Boarder", image: "https://mediumrare.imgix.net/655249307fb8240db8d6648421990843502a793ec60591c2b27fdaef744795e5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Waked", image: "https://mediumrare.imgix.net/2d4e31f4a7d5f7ea70503d5ba99ce20b2e6eb6bf6aaa63a5e4cfca5f8186a5e9?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "True Kult", image: "https://mediumrare.imgix.net/b8c7c54caa9354397386209f1598af6061eb2e8620221ac111646f312351e733?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Barbarian Fury", image: "https://mediumrare.imgix.net/4504d296fc5f1e9fe5445e61e11f721b10cbc8f972e678872601e8691fee2cbd?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Coins of Fortune", image: "https://mediumrare.imgix.net/63d079d1db0688e108015d5375d3f9fceef3ee7f840eb3bff981c95e7b544f59?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood and Shadow", image: "https://mediumrare.imgix.net/51c4fe897d1c10590b228d7255b6c474357ec6f1c04e4286b03d52a197a3c222?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kiss My Chainsaw", image: "https://mediumrare.imgix.net/bdfee60eeb0e46f3fde4cf7e2672711715c978f07392ade094836b5dc32b49d6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tomb of Akhenaten", image: "https://mediumrare.imgix.net/c9d4e56962e81284b267b4ea668fc830fab41a96cf2f4a1158a446e5872823c4?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Legion X", image: "https://mediumrare.imgix.net/dd3d10c1778385d21443f1807c64f22b34d2a65c52fa4eb695b6e260c40554b5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "True Grit Redemption", image: "https://mediumrare.imgix.net/68552e953aeae114fe69fbfc5203b2ef2b2b2fe87bc9b277ebdb593546a3bfe5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Gluttony", image: "https://mediumrare.imgix.net/df36859126cc991e9a2766277d7356cc4c8dd3d81db3f0a0720dd9aecc13e491?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Little Bighorn", image: "https://mediumrare.imgix.net/22d2c08af82a97b0644063771563b61a0b7053dc095f123bf74d83aa0f7f2f67?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Cage", image: "https://mediumrare.imgix.net/26f729a51236a7c96e45453f9643a8bb99b0a65835fd05049315929ccfd36d5a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Rock Bottom", image: "https://mediumrare.imgix.net/51f733ffc60b5da5daa4fdb1a5174e10c1c31b2bdd454f1d068028cba3280995?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Golden Genie and the walking wilds", image: "https://mediumrare.imgix.net/23a5e9d40a75cbeb124c527b989fd48468fe45db9a1639de91cc5f52d19d7b26?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Gaelic Gold", image: "https://mediumrare.imgix.net/8efc6aec875332fb59e5767ee16b69edc2e4fb277fa2acccd896f21a0bbcc37d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "DJ Psycho", image: "https://mediumrare.imgix.net/22c9730272521443996cbe24cd2011da48e6caff4543c99fcebd0e584a10d365?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Rocker", image: "https://mediumrare.imgix.net/0a1d1fa465dc6842277aa8f2ce462932269f6e7cc1b680a0de201fdaa25d3fbc?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Walk of Shame", image: "https://mediumrare.imgix.net/e9d1159dc4ec26b40a436c9f1c3bceae323c552dd1e5c206d6ab4c93a61ba7fe?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dragon Tribe ", image: "https://mediumrare.imgix.net/a2f7dabe8bc0947a89e80a60ba13b27814e5eef6bd1d45b4082c7310b9468463?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bounty Hunters", image: "https://mediumrare.imgix.net/1b3e19c5dadcd298327774785a0ef6dad6128a2ffd323637a85eb34ed859b3ef?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Lucky Barrel Tavern", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-LuckyBarrelTavern.jpg", provider: "Belatra" },
  { name: "Pirate Jackpots", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-PirateJackpots_designed.jpg", provider: "Belatra" },
  { name: "Big Wild Buffalo", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-BigWildBuffalo_designed.jpg", provider: "Belatra" },
  { name: "Gold Rush With Johnny Cash", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.softswiss-GoldRushWithJohnny_designed.jpg", provider: "Bgaming" },
  { name: "Ultimate Slot of America", image: "https://mediumrare.imgix.net/4e212f817a163d07b8d65cda3e07ec94e2dac06cc520b26ff98ed97d4b63e33d?q=85", provider: "Hacksaw" },
  { name: "Crabbys Gold", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiIzlYWupxTSBhZzJ13zkZyp3saTRA7eml9Q&s", provider: "Play n Go" },
  { name: "Alice Cooper And the Tomb of Madness", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_pCgBW35jR7SNLHawrRNh0qP-vLcM0dQCEg&s", provider: "Play n Go" },
  { name: "Mighty Munching Melons", image: "https://mediumrare.imgix.net/148378d0a48bc442079c38baa4a8dbd1c44f5edbe34683321efba6d34a783d37?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Sky Bounty", image: "https://mediumrare.imgix.net/fbd7a2ba07635bf8178c91c910f92d85ffa4fd4320a52885e7f6d005e872b8a6?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight x1000", image: "https://mediumrare.imgix.net/95b7a5cf3b8fb3c41d81717e4bcf4dd615a0cc2256faee80684d824d93a3d3c7?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Pachi", image: "https://mediumrare.imgix.net/b5e8b647424bb8960eb480cd8d0015fc2a5e6af496255608a6ce6149521a1dfa?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Christmas", image: "https://mediumrare.imgix.net/95ae43b4eac22162e71ece7b111c5a45ae1c93bdfdeb141d3ccea0bc6652c0ef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Princess", image: "https://mediumrare.imgix.net/298229a9a43ea31dd37bb4f356055014eb7e45c570cf06aa59cb2bacbdd65919?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Coin Strike Hold And Win", image: "https://mediumrare.imgix.net/1bbcfa17f0283f09c5edf293c154574c927df12bd52775fc6dc874641d11759c?w=180&h=236&fit=min&auto=format", provider: "Playson" },
  { name: "Hoot Shot The Sheriff", image: "https://mediumrare.imgix.net/2dd6367518c2dde0ab0be6dcbf67e27bf31b360b1723402ecd3cfe47b6f5c7d8?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Home of Thor", image: "https://mediumrare.imgix.net/494fd72c6cf90e055067ad69506ad0b4a7cde8b99fe8847ffd09d77b5b125e36?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Roman Bonanza", image: "https://mediumrare.imgix.net/73ca7c50b447324bb570226b2efe75d420ad977aaee516e6697c955e022a0de6?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gladius Death or Glory", image: "https://mediumrare.imgix.net/789931cb460223cc303dcec9bf8a2e4c8c431cfd8e78c84f979f1eb5ad4cb653?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pirate Bonanza", image: "https://mediumrare.imgix.net/dadbe45e9f2c2f6a057f168e0a9ef68077f684d9bb26db491ee9e3b49229c8d6?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chocolate Rocket", image: "https://mediumrare.imgix.net/a858c07e77c66ada9faf506731adf24b23f67e29a0c424b342fef668006c2c1e?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chicken Man", image: "https://mediumrare.imgix.net/780e3ff5ea3219edf3f7b75223a5ed9064131025479d0da947877534a6d9180a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Barrel Bonanza", image: "https://mediumrare.imgix.net/78853c4c98bbc63173678f9a29fa16f693261b7d72b5fc21754dc780f8e376a3?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Sleepy Grandpa", image: "https://mediumrare.imgix.net/a5c9c0e7964070f2ccc2084e5805f1f4847d640e1a1c3f8e32dc37be96131d8f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Super Twins", image: "https://mediumrare.imgix.net/eca3bbafa4c064ef4e32c908bd73c2060ecfb9ce71e5fb6f219c6d731a0d5f7f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Clumsy cowboys", image: "https://mediumrare.imgix.net/4c89dd9137d1f916f9c61059e50ef52c7aa797a6b29bed222c41c35642c48e1e?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shadow Strike", image: "https://mediumrare.imgix.net/f7043863474ce6a878eba4d1beb8c945be72b8fdaa79a48674e031b286e85488?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Blaze Buddies", image: "https://mediumrare.imgix.net/98b3f905da6fffb734d1333f5c6e1be3b8f4d50427339d11d1a2a58134d88e86?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Crystal Robot", image: "https://mediumrare.imgix.net/e20cb67dce597579213cf775cd799a6b5c0d312df0c155f7ed56669668824975?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Old Gun", image: "https://mediumrare.imgix.net/651407a0e2f495f40a4437b70e2cd22251030892709d8941577dc4d56042c042?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Infernus", image: "https://mediumrare.imgix.net/3cb55c7cef40ec3e4c5e72a31878a1eada01665bed706b23ae0375cd43eb6743?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fireborn", image: "https://mediumrare.imgix.net/ba872c286648c95b753edd2576f28592d947ebd27f100eb60ba98b5bc388d502?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Desert Temple", image: "https://mediumrare.imgix.net/598e3ad44572857dea16a8a0851618cc2a487f19cb9a21f8e8d165a020eda510?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Cursed King", image: "https://mediumrare.imgix.net/b7306f0ebca9848dbef7dd4cd9e229c0673df5a95c61e30efc4a1cef7e1bbe23?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Commander of Tridents", image: "https://mediumrare.imgix.net/c8e85b5b311d82a8bba1b76429384f0c33178e25c63f2f86b38d49acb8b6a372?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Space Zoo", image: "https://mediumrare.imgix.net/40e5fc070c8c0dad1d726ff7010f49a1adf459d34d79a059323a0a2140da1adb?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Blade Master", image: "https://mediumrare.imgix.net/07a947a8fb11abc7aa52c9628a94d0a997b254b0759dfdf4a4c08359660351ba?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fury and Fortune", image: "https://mediumrare.imgix.net/9ade85dd180196247b53d8c254f4671255b34a44d8dba44b50d658db065a6f8b?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Age of Seth", image: "https://mediumrare.imgix.net/92e2a40a3d7a55c8d768b817bcc2b4ca91a30808de3784f40288496e7854e7a5?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pickle Bandits", image: "https://mediumrare.imgix.net/001a175a54e58ef21a2db846cd9f8fae84d9092d09150c444fdefa34abe11f7a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ancient Paws", image: "https://mediumrare.imgix.net/76920357a8ae701cab16a1157eec612bbe4e87a301c13493af5caf2d89bc970f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Valhalla Wild Winter", image: "https://mediumrare.imgix.net/e8cd1684359b7db17be29356fb29a7d5cefa42fef7cbddef9cefd4596c167eb1?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Clover Club", image: "https://mediumrare.imgix.net/95a3cfec930a6c90174d1c2699ec737872ee9ba6a8fd1fabc6f9abd69144d26d?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Jawsome Pirates", image: "https://mediumrare.imgix.net/6574ed2ce9866147ecb75af5ba09d7d2e84203d3872a40d27aea44f2865346e9?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Junkyard Kings", image: "https://mediumrare.imgix.net/e996d178a481fdf2f0f190ff3533c9aa69e7cce37b092d9a18bece5ad8664dde?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Amazing Miceketeers", image: "https://mediumrare.imgix.net/30f7870d14c0414bd140bd9cd6bb7ee0e401a8be1fc1e43b8bcfbbb3ea6e4d9d?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mafia Clash", image: "https://mediumrare.imgix.net/430d97801ce54a8813dfee68c893cb9dbef32a3ca43b17d71790d86e7e01bd55?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Empress of Shadows", image: "https://mediumrare.imgix.net/aac93823c6b13375e6b5ac9ef4007d73f31e6abf93c72173962683768487a447?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Piggy Cluster Hunt", image: "https://mediumrare.imgix.net/040b99f34688458edcfb0aa6e9c7be4c0796d45e93629799aacec22946b82331?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Coop Clash", image: "https://mediumrare.imgix.net/75fabc4e0c30ff04b74baf6e55572e0276cd7b176407f94bbd145abd4d657511?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Holy Heist", image: "https://mediumrare.imgix.net/24f65e1310d76a41e84570b874d8c8c55f874b11a4677a8f090cfd81f793594a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wild Dojo Strike", image: "https://mediumrare.imgix.net/9c204c09cc4a6f9487f8783967f97d7f164f0467d35010e1529f5540db55d536?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Merlins Alchemy", image: "https://mediumrare.imgix.net/65cdec3e6fd95d36b9514019cb5f52e3a6a8aabcde244427f765122d71ccf424?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Super Sticky Piggy", image: "https://mediumrare.imgix.net/930b0d1222ff53fd1ffbb7da06404686086ab76cfa0534a9cedd4808351eac7e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Azetec Temples", image: "https://mediumrare.imgix.net/071784a3c8fb2f33db1d0239e5bbb5142ba5e67ed5a68062c65a84ffd90d8e82?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Express", image: "https://mediumrare.imgix.net/04f5a2af73d423c11b88f5617c5e33c6549cb25d46f16d5d6a1fa4ca178a34b7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lucky Penny", image: "https://mediumrare.imgix.net/28a4db71a382de03662ffd82a60d849ecc411c1ff8e1305afc4f393a3482142e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Up Hot Fire", image: "https://mediumrare.imgix.net/9ed38eb56824505f9383f13f20b8425432e74dbfbd85fc94c3cc7253708cb1a5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 China Pots", image: "https://mediumrare.imgix.net/db9c7dd74f574eb8152a25571a13bd5773abe6b02f89ed02af5ae0b4d7f7b5db?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Azetec Fire 2", image: "https://mediumrare.imgix.net/d1c594b4d290e28426d986815bbc15c84d84c283103c5becc2ad799a9d50e751?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "15 Dragon Pearls Hold and Win", image: "https://mediumrare.imgix.net/e03cfdaecaf15311d6dcb09bda329a504de15c8bc6b0fe05afc6ba51c5646a07?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Coins", image: "https://mediumrare.imgix.net/621fd8e92d3188f5cef0101653efd26fed12e6dcdfb35df7289b485f1218e41f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Clover Pots Extra", image: "https://mediumrare.imgix.net/972fe13ebdadaf052c44891e1ecec455d7b5622670eed5c17d2f8c8d3476237d?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Power Sun", image: "https://mediumrare.imgix.net/45f92b15b5bdf43a622b049d4b8f7acc26a0693ed1302c26bb12829e74bc0be6?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Lamp", image: "https://mediumrare.imgix.net/57199aa61a0f2189cca12cd12c5a8e4e5dd0541399cce6a9332e48212e998903?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 african Drums", image: "https://mediumrare.imgix.net/e1dcddd9e52221ce7dc2f24a29fcbec3335ae336e11a00bcde05c26ec35de7fb?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "777Coins", image: "https://mediumrare.imgix.net/5fdd0f5ad0a7dd0e713db0f1372aca76de49ca0d6866910c3a3e3268e11989d9?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Clover Pots", image: "https://mediumrare.imgix.net/44e80eb7111efbe9927c6101eea5017eb6dd9526425d27be53ef8a845a6c4dbf?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Gold Express hold and win", image: "https://mediumrare.imgix.net/5d0a130daf3e7ed5cb2823e9d303c98993a6f3f7a9d96d67209113cde549f13c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sticky Piggy", image: "https://mediumrare.imgix.net/deefc5e0757b58b3b72e85d8b93e684e2c18de266e9cfe3e409ac25d1d809237?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Black Wolf", image: "https://mediumrare.imgix.net/60104008239b3b6f734862dbd9d731f6d9f664d0a22105e0a7acc72925fa2720?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "777 Gems Respin", image: "https://mediumrare.imgix.net/1ea512d33cc417120241529fb5f561029696978431148c2ae4c9f3a0fa976af7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Coins Egypt", image: "https://mediumrare.imgix.net/57cdd483aea608082a1c8400ac2fbee62adf7953f420e1b691f2e0db01756288?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Aztec Fire", image: "https://mediumrare.imgix.net/4cf62cb9a03c4044b8e95130b71602d672491ff2c18d52f5fc3b21a69250940f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Boom Boom Gold", image: "https://mediumrare.imgix.net/a3b2f5cf9c9af7b002782e14986c4edf6db349d2a77ae5757b897f37ed18fcf5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wolf Saga", image: "https://mediumrare.imgix.net/c52670de69bf9624d0750e41d37b6e4874acb2c0f009b652c6cc263e61ce566a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sky Pearls hold and win", image: "https://mediumrare.imgix.net/080225396949e7289ee4d69fb7bdd20692020516a8c60daa512e0148ba5b980d?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Super Rich God hold and win", image: "https://mediumrare.imgix.net/b79ac43e2450503e1857123a8a20f6e6e99975a1f31343f48b1aceee35c141c5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lamp of Wonder", image: "https://mediumrare.imgix.net/9ce3b4a76552122bffc281f4f827d61ec97900ea599ff77cab9b0511febe17eb?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Aztec Sun", image: "https://mediumrare.imgix.net/92f1b5880c722df3a8cbcb33bb0589112a9c6b2fd7623f889cb4ec170a16c0c8?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Green Chilli 2", image: "https://mediumrare.imgix.net/12599373725b87b6ec24797e33464bc0292d54834e73442ed215871660e6edac?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Gold Nuggets", image: "https://mediumrare.imgix.net/9bea1531180cb2c1dcc7b5dee11cef7d1a13d164ed491c8fcfbd41cde742430b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Buddha Fortune hold and win", image: "https://mediumrare.imgix.net/35667059107b4c4553e97529b46ed4a43d7ff92d09f1f206c7b562ca0831ecfc?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 3", image: "https://mediumrare.imgix.net/35667059107b4c4553e97529b46ed4a43d7ff92d09f1f206c7b562ca0831ecfc?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Wizard", image: "https://mediumrare.imgix.net/8a200ff10c0a0959191eeec4a04e81abf1a4e3f38ef33c036c766ff45d4a204b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Egypt Fire", image: "https://mediumrare.imgix.net/079efcf2de2128c051851169626a122c675f9537858fadde2701740a88a13540?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Egypt Chests", image: "https://mediumrare.imgix.net/b11b369e363bbb7f4f737c131b331b2dd6cd1bcfef93ed4ed668f3c0476d0477?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "More Magic Apple", image: "https://mediumrare.imgix.net/a083159b729f372718228af4c8846d4e340f8f277dfdc57159861de709f706f0?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Black Wolf2", image: "https://mediumrare.imgix.net/7eaddd14ee23047b93e35de60e9f219359f15b0f8db01e9cfdd7bd072e32bd1c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wukong hold and win", image: "https://mediumrare.imgix.net/939dda8ac532dd70b2be908d0f9f5a3597b569f8a1fdbfc0a83e932d4fce0240?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Candy Boom", image: "https://mediumrare.imgix.net/ad2289244507a5703e9d92f3c9bc8905ef2972e4a21bdfbaf232a37972c5f801?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lion Coins", image: "https://mediumrare.imgix.net/d13ff7870a2b75ac9f85715e87e8e8c86072eaa6a1b2ac8e51b9b358955beb5e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 4", image: "https://mediumrare.imgix.net/e8d47571b009ab8ffe6dd37a647679301b30dd111d99c0f4b5c578a1f0becffe?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Super Marble ", image: "https://mediumrare.imgix.net/00386712d83db3dccfed2ba1b97e04251410f74f3b9de4d68f35adafed75f1e7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wolf Night", image: "https://mediumrare.imgix.net/1a9d36ecbf44facdc52553f91f4d7c52a5cd34e0401ec64b85a20c5c975c054f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Temple", image: "https://mediumrare.imgix.net/d663666695dd89f889506c445793aa8a55af8d79c534d82e200d18525f6b0e5b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Tiger Gems", image: "https://mediumrare.imgix.net/819a3b214aaa54ba07b3b3da8bcb6f71549d01baf388d5f826a31fb743388bf1?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Sun", image: "https://mediumrare.imgix.net/0fac23ed8fece3e090f516e8b1cc73a4bcc504e2d59dfda6dad1476a62f4d879?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Dragon Wealth", image: "https://mediumrare.imgix.net/0c7fa15af4e211b91f80945e18fae6297f44d86782b8c7c23f7d7c38fae3a587?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hit More Gold", image: "https://mediumrare.imgix.net/15b2c1465156598cfbf4f8c4e039f81a1cd49984358663ff4e67174b75900315?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Big Heist", image: "https://mediumrare.imgix.net/d776ed24ec3472f63f8527bc074d02a7f4b08b512a3833b3593f1ae6c0a23723?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Pearl Diver 2", image: "https://mediumrare.imgix.net/7dde31ccc03a7d68514d9da0c79ece137df6e21bd701f8295d56dfaac7f8f95f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Moon Sisters", image: "https://mediumrare.imgix.net/c2c2fe9d13508344796c41b0bbfec9f1def07745c248eaaab3949d895acd7815?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "China Festival", image: "https://mediumrare.imgix.net/abbaea8b14c8887d40dfb4b8adef86a8009265cd146fa87dd869e62468ed44d4?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Crystal Scarabs", image: "https://mediumrare.imgix.net/05f51912bf4f9a9d8979dc2c7c879ceec9430489c88b12a0ab5b4ee8b86e4188?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Dragon Pearls", image: "https://mediumrare.imgix.net/d8cc824c6c095f5d3f7cda2113d5044a079538667cd9b3ee284254329041c768?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Eggs Of Gold", image: "https://mediumrare.imgix.net/0debc0f807210f01e6cb67c86ca062966c3932804f5a35319b0353e8701779b8?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Sun Multichance", image: "https://mediumrare.imgix.net/d43eddf41b3becc18d7b94559746f8d91993ec7197c407eba3d30551fb6d6c21?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Little Farm", image: "https://mediumrare.imgix.net/fd702ebd03c58ca2e6fd344c30247f3ce43a5a87c5a9b597cfe0c2bf92d1b0ef?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 2", image: "https://mediumrare.imgix.net/8825caf4e011a82f6b4ab7cde9653e854eefa7e33d273e0f23ad22bfd898d3da?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hit the Gold", image: "https://mediumrare.imgix.net/0a8b1b5b9f9b778d429bdfaa238c65877b7a6c18f0eec8a638f10c3286e88fb5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Tiger Jungle", image: "https://mediumrare.imgix.net/b2fa6c7e82f5c2839436b653b91a270836ec777584e8df16acbc3101ef83222c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Magic Apple hold and win", image: "https://mediumrare.imgix.net/a22a2f6e8c6ab471b63360ded16bb0b0424efa6b702c37a52f93363fd527c116?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Riches", image: "https://mediumrare.imgix.net/4d61f0b7ee09f07432685182a6c7c9e00e41d36e47b6c46d409e966f4363e8fe?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Green Chilli", image: "https://mediumrare.imgix.net/b837d588cb4a8199572f6f827f0632952eeb4f39c134e0843975ee6ed0239c6a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Grab More Gold", image: "https://mediumrare.imgix.net/d364aede7b248334cfb8dbdf67de6f2d54b4e19136db12d343862eeb40d4072e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Queen of the Sun", image: "https://mediumrare.imgix.net/38314d61a8304e913837db18fd4780f33c1014ceaebe632be731200b15c3ccd4?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lord of Fortune 2", image: "https://mediumrare.imgix.net/d56c8a88317c63b1bc12e1fe80fdbd4bda26a3d22d77ab564c97ded8e0d18481?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Grab The Gold", image: "https://mediumrare.imgix.net/52831c048112281517141ce57469d30273fd054277f25c18e6248831f26b9124?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Thunder of Olympus", image: "https://mediumrare.imgix.net/724ab9940c8982543f86a8302267fab8a28e98639a53553525c9fd6148d991f9?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Olympian Gods", image: "https://mediumrare.imgix.net/e59fdc1189227290ecd326337237a4b620100869c23b181178326a51b2a19fcf?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Boost", image: "https://mediumrare.imgix.net/c07923607eafd12e0b85a2857383ce206269d675f6632133d6d514d431482ea1?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hawaii Riches", image: "https://mediumrare.imgix.net/0962cd59b027d298c6bf47ffa478213fd01b417eb23d639b017c74b182153a90?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Maya Sun", image: "https://mediumrare.imgix.net/be4bc87e518f6b853ce51041d5859f895b15d84db6e318c576906fb9a348f84a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Rio Gems", image: "https://mediumrare.imgix.net/a942741a93e50087501324c66e5fb14bbe6148ea7f9e74f3a79df311f504a138?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sunlight Princess", image: "https://mediumrare.imgix.net/9b6f42ca523917040493a9c87ac11140365dea736c23ec13913d8823cfeab920?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt", image: "https://mediumrare.imgix.net/f480d50fed347d852024d7f19033e86ba083bcf747fac31eb4f9a67ae981a8c2?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Magic Apple2", image: "https://mediumrare.imgix.net/4005c84b0b69377b8e2c82f5d88c081abd84dffe35b7f07d13cff1bbcb8ca3f5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },  
  { name: "Gates of Hades", image: "https://mediumrare.imgix.net/60206bb76f8d15dd2975ea5d5c908194c66a1183683e6988c83027ada9befbef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" }
    // ...add more slots as needed
  ];

  // --- Slot Name Suggestion Dropdown ---
  if (slotNameInput) {
    let suggestionBox = document.createElement('div');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = '#23272f';
    suggestionBox.style.color = '#fff';
    suggestionBox.style.borderRadius = '8px';
    suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    suggestionBox.style.zIndex = '1001';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '220px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.fontSize = '1rem';
    suggestionBox.style.padding = '0.2rem 0';
    suggestionBox.className = 'slot-suggestion-box';
    document.body.appendChild(suggestionBox);

    slotNameInput.addEventListener('input', function () {
      const value = slotNameInput.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '0.4rem 1rem';
        item.style.cursor = 'pointer';
        item.innerHTML = `
          <img src="${slot.image}" alt="${slot.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:0.7rem;">
          <div>
            <div style="font-weight:600;">${slot.name}</div>
            <div style="font-size:0.92rem;color:#b0b3b8;">${slot.provider}</div>
          </div>
        `;
        item.addEventListener('mousedown', function (e) {
          e.preventDefault();
          slotNameInput.value = slot.name;
          suggestionBox.style.display = 'none';
          slotNameInput.dispatchEvent(new Event('input'));
          // Focus bet size input after selecting a suggestion
          if (betSizeInput) betSizeInput.focus();
        });
        item.addEventListener('mouseover', function () {
          item.style.background = '#9147ff';
        });
        item.addEventListener('mouseout', function () {
          item.style.background = 'transparent';
        });
        suggestionBox.appendChild(item);
      });
      // Position the suggestion box below the input
      const rect = slotNameInput.getBoundingClientRect();
      suggestionBox.style.left = rect.left + window.scrollX + 'px';
      suggestionBox.style.top = rect.bottom + window.scrollY + 'px';
      suggestionBox.style.minWidth = rect.width + 'px';
      suggestionBox.style.display = 'block';
    });

    // Hide suggestions on blur
    slotNameInput.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 100);
    });
  }

  // Add slot to Bonus List on Enter in Bet Size input
  // Ensure there is a <ul> inside .bonus-list, create if missing
  let bonusListUl = document.querySelector('.bonus-list ul');
  if (!bonusListUl) {
    const bonusListDiv = document.querySelector('.bonus-list');
    if (bonusListDiv) {
      bonusListUl = document.createElement('ul');
      bonusListDiv.appendChild(bonusListUl);
    }
  }
  // --- Super checkbox logic ---
  const superCheckbox = document.getElementById('super-checkbox');
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const slotName = slotNameInput.value.trim();
        const betSize = betSizeInput.value.trim();
        if (slotName && betSize) {
          // Try to find slot in database for image
          let slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
          let imgSrc = slot ? slot.image : DEFAULT_SLOT_IMAGE;
          // Create new list item with image and highlight classes
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="${imgSrc}" alt="${slotName}" class="slot-img">
            <span class="slot-name">${slotName}</span>
            <span class="slot-bet">€${parseFloat(betSize).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          `;
          // Highlight if super checkbox is checked
          if (superCheckbox && superCheckbox.checked) {
            li.classList.add('super-slot');
            superCheckbox.checked = false; // Optionally uncheck after use
          }
          bonusListUl.appendChild(li);

          // Optionally clear inputs
          slotNameInput.value = '';
          betSizeInput.value = '';
          slotNameInput.focus();

          renderBonusHuntResults();
          updateBonusListCarousel();
        }
      }
    });
  }

  // --- Bonus Opening Payout Panel Logic (Vanilla JS, styled to match your app) ---

  function getBonusListData() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return [];
    // Only use non-clone lis for calculations and payout
    return Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null
        };
      });
  }

  let payoutPanel = null;
  let payoutBonuses = [];
  let payoutIndex = 0;

  function showPayoutPanel() {
    if (payoutPanel) return;
    payoutBonuses = getBonusListData();
    if (!payoutBonuses.length) return;

    payoutIndex = 0;
    payoutPanel = document.createElement('div');
    payoutPanel.className = 'middle-panel';
    payoutPanel.style.display = 'flex';
    payoutPanel.style.flexDirection = 'column';
    payoutPanel.style.alignItems = 'center';
    payoutPanel.style.position = 'fixed';
    payoutPanel.style.top = '50%';
    payoutPanel.style.left = '50%';
    payoutPanel.style.transform = 'translate(-50%, -50%)';
    payoutPanel.style.zIndex = '1001';
    payoutPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    payoutPanel.style.borderRadius = '24px';
    payoutPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    payoutPanel.style.padding = '2rem 1.5rem';
    payoutPanel.style.width = '400px';
    payoutPanel.style.height = '420px';

    document.body.appendChild(payoutPanel);
    renderPayoutStep();
  }

  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  function getSlotImage(slotName) {
    // Use the slotDatabase defined in this script
    const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    return slot ? slot.image : DEFAULT_SLOT_IMAGE;
  }

  // --- Hook up Bonus Opening button ---
  // Remove duplicate event listener for bonusOpenBtn
  // Only keep the payout panel logic, not the slot card logic, for the "Bonus Opening" button
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
    });
  }

  function renderBonusHuntResults() {
    const startBalance = parseFloat(document.getElementById('start-money-input')?.value) || 0;
    const openingBalance = parseFloat(document.getElementById('stop-money-input')?.value) || 0;
    // Only use non-clone lis for calculations
    const bonusListUl = document.querySelector('.bonus-list ul');
    const bonuses = bonusListUl
      ? Array.from(bonusListUl.children)
          .filter(li => !li.classList.contains('carousel-clone'))
          .map(li => {
            const spans = li.querySelectorAll('span');
            let slot = spans[0] ? spans[0].textContent : '';
            let bet = spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0;
            let result = 0;
            if (li.dataset && li.dataset.payout) {
              result = parseFloat(li.dataset.payout) || 0;
            }
            return { slot, bet, result };
          })
      : [];

    const stats = calculateBonusHuntStats(startBalance, openingBalance, bonuses);

    const resultsDiv = document.getElementById('bonus-hunt-results');
    if (!resultsDiv) return;
    resultsDiv.innerHTML = `
      <div class="bhr-compact" style="
        display:grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 0.07rem 0.2rem;
        font-size: 0.89rem;
        line-height: 1.08;
        ">
        <div><span class="bhr-label">Bon:</span> <span class="bhr-value">${stats.bonuses}</span></div>
        <div><span class="bhr-label">Pft:</span> <span class="bhr-value ${stats.totalProfit >= 0 ? 'bhr-profit' : 'bhr-loss'}">€${stats.totalProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Bet:</span> <span class="bhr-value">€${stats.averageBetSize.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Win:</span> <span class="bhr-value">€${stats.averageWin.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">X:</span> <span class="bhr-value">${stats.averageX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BE X:</span> <span class="bhr-value">${stats.breakEvenX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BEB:</span> <span class="bhr-value">€${stats.breakEvenPerBonus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">BE:</span> <span class="bhr-value">€${stats.breakEven.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Cost:</span> <span class="bhr-value">€${stats.totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Ret:</span> <span class="bhr-value">€${stats.totalReturn.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
      </div>
    `;
  }

  // --- Call renderBonusHuntResults on relevant changes ---

  // After start/stop money input
  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  // After bet size input
  if (betSizeInput) {
    betSizeInput.addEventListener('input', renderBonusHuntResults);
  }

  // After adding a bonus to the list, update the results
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        // After adding the li:
        renderBonusHuntResults();
      }
    });
  }

  // When a payout is entered in the payout panel, store it as a data attribute and update results
  function setBonusPayout(slotName, payout) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .forEach(li => {
        const spans = li.querySelectorAll('span');
        if (spans[0] && spans[0].textContent === slotName) {
          li.dataset.payout = payout;
        }
      });
    renderBonusHuntResults();
  }

  // In renderPayoutStep, after payout is entered, call setBonusPayout
  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  // Initial render on page load
  document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    renderBonusHuntResults();
  });

  // --- Carousel Animation for Bonus List ---
  function setupBonusListCarousel() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    // Remove previous clones if any
    Array.from(bonusListUl.querySelectorAll('.carousel-clone')).forEach(clone => clone.remove());

    // Only clone the original items (not clones)
    const items = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone'));
    if (items.length === 0) return;

    // Clone all original li elements and append for seamless loop
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.classList.add('carousel-clone');
      bonusListUl.appendChild(clone);
    });
  }

  function updateBonusListCarousel() {
    setupBonusListCarousel();
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    // Only count original items (not clones)
    const itemCount = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone')).length;
    // Animation duration: 2s per item, min 6s, then double for 0.5x speed
    const duration = Math.max(6, itemCount * 2) * 2;
    bonusListUl.style.animationDuration = duration + 's';
  }

  // Patch add-to-list logic to update carousel
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        bonusListUl.appendChild(li);
        updateBonusListCarousel();
      }
    });
  }

  // On page load, setup carousel if there are items
  document.addEventListener('DOMContentLoaded', () => {
    updateBonusListCarousel();
  });

  // --- Navbar Image Switcher ---
  const navbarImages = [
    {
      src: "https://i.imgur.com/KBHsq6S.png",
      alt: "C.balance"
    },
    {
      src: "https://i.imgur.com/bdpt4I7.png",
      alt: "Raw"
    },
    {
      src: "https://i.imgur.com/H5lK0WA.png",
      alt: "wager"
    }
  ];
  let navbarImageIndex = 0;
  const navbarImg = document.getElementById('navbar-image-switcher');
  const navbarLink = document.getElementById('navbar-image-link');
  function updateNavbarImage() {
    if (!navbarImg || !navbarLink) return;
    navbarImg.src = navbarImages[navbarImageIndex].src;
    navbarImg.alt = navbarImages[navbarImageIndex].alt;
    navbarLink.href = navbarImages[navbarImageIndex].link;
  }
  if (navbarImg && navbarLink) {
    navbarImg.addEventListener('click', (e) => {
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    // Also allow clicking the link to cycle (optional)
    navbarLink.addEventListener('click', (e) => {
      // Only cycle if clicking the image, not the link itself
      if (e.target === navbarImg) return;
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    updateNavbarImage();
  }

  // --- Slot Highlight Card (Bottom Left) ---
  let slotHighlightCard = null;
  function updateSlotHighlightCard() {
    // Only show if BO is active
    const boBtn = document.getElementById('bo-btn');
    if (!boBtn || !boBtn.classList.contains('active')) {
      if (slotHighlightCard) {
        slotHighlightCard.remove();
        slotHighlightCard = null;
      }
      return;
    }

    // Remove old card if present
    if (slotHighlightCard) {
      slotHighlightCard.remove();
      slotHighlightCard = null;
    }

    // Get bonus list data (with payouts)
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null,
          img: li.querySelector('img') ? li.querySelector('img').src : DEFAULT_SLOT_IMAGE
        };
      });

    if (!bonuses.length) return;

    // Find best (highest payout), worst (lowest payout), and current (first with payout==null)
    let best = null, worst = null, current = null;
    const bonusesWithPayout = bonuses.filter(b => typeof b.payout === 'number' && !isNaN(b.payout));
    if (bonusesWithPayout.length) {
      best = bonusesWithPayout.reduce((a, b) => (b.payout > a.payout ? b : a), bonusesWithPayout[0]);
      worst = bonusesWithPayout.reduce((a, b) => (b.payout < a.payout ? b : a), bonusesWithPayout[0]);
    }
    current = bonuses.find(b => b.payout === null || isNaN(b.payout));

    // Always show 3 slots: left=best, middle=current, right=worst (even if some are the same)
    const slotsToShow = [
      best ? { ...best, type: 'best' } : null,
      current ? { ...current, type: 'current' } : null,
      worst ? { ...worst, type: 'worst' } : null
    ];

    // If all are null, don't show
    if (!slotsToShow[0] && !slotsToShow[1] && !slotsToShow[2]) return;

    // Card container (bigger, with gradient background)
    slotHighlightCard = document.createElement('div');
    slotHighlightCard.style.position = 'fixed';
    slotHighlightCard.style.left = '24px';
    slotHighlightCard.style.bottom = '24px';
    slotHighlightCard.style.width = '540px';
    slotHighlightCard.style.height = '210px';
    slotHighlightCard.style.background = 'linear-gradient(135deg, #9147ff 0%, #00e1ff 100%)';
    slotHighlightCard.style.borderRadius = '38px';
    slotHighlightCard.style.boxShadow = '0 17px 67px 0 rgba(0,0,0,0.28)';
    slotHighlightCard.style.display = 'flex';
    slotHighlightCard.style.alignItems = 'center';
    slotHighlightCard.style.justifyContent = 'space-between';
    slotHighlightCard.style.zIndex = '1000';
    slotHighlightCard.style.padding = '0 32px';
    slotHighlightCard.style.gap = '0px';
    slotHighlightCard.style.border = '3px solid #fff2';

    // Pill colors
    const pillColors = {
      best: '#00ff7a',
      current: '#ffe600',
      worst: '#ff3b7a'
    };
    const pillLabels = {
      best: 'Best',
      current: 'Current',
      worst: 'Worst'
    };

    // Helper to render a slot card (empty if slot is null)
    function renderSlot(slot, type) {
      // Outer container (bigger)
      const card = document.createElement('div');
      card.style.position = 'relative';
      card.style.width = '160px';
      card.style.height = '190px';
      card.style.borderRadius = '28px';
      card.style.overflow = 'hidden';
      card.style.background = '#23242a';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
      card.style.margin = '0 8px';

      if (!slot) {
        // Empty placeholder
        card.style.opacity = '0.25';
        card.style.background = '#444';
        return card;
      }

      // Slot image fills card
      const img = document.createElement('img');
      img.src = slot.img;
      img.alt = slot.name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.borderRadius = '28px';
      card.appendChild(img);

      // Top pill (type) - move higher (closer to top)
      const topPill = document.createElement('div');
      topPill.textContent = pillLabels[type];
      topPill.style.position = 'absolute';
      topPill.style.top = '3px'; // was 14px, now much closer to top
      topPill.style.left = '50%';
      topPill.style.transform = 'translateX(-50%)';
      topPill.style.background = pillColors[type];
      topPill.style.color = '#23242a';
      topPill.style.fontWeight = 'bold';
      topPill.style.fontSize = '1.0rem';
      topPill.style.padding = '6px 26px';
      topPill.style.borderRadius = '999px';
      topPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      topPill.style.letterSpacing = '0.5px';
      card.appendChild(topPill);

      // Bottom pill (payout)
      const payoutPill = document.createElement('div');
      payoutPill.textContent = typeof slot.payout === 'number' && !isNaN(slot.payout)
        ? `€${slot.payout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`
        : '--';
      payoutPill.style.position = 'absolute';
      payoutPill.style.bottom = '3px';
      payoutPill.style.left = '50%';
      payoutPill.style.transform = 'translateX(-50%)';
      payoutPill.style.background = '#f3f4f6';
      payoutPill.style.color = '#23242a';
      payoutPill.style.fontWeight = 'bold';
      payoutPill.style.fontSize = '1.0rem';
      payoutPill.style.padding = '7px 22px';
      payoutPill.style.borderRadius = '999px';
      payoutPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      payoutPill.style.letterSpacing = '0.5px';
      card.appendChild(payoutPill);

      return card;
    }

    // Render left (best), middle (current), right (worst)
    slotHighlightCard.appendChild(renderSlot(slotsToShow[0], 'best'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[1], 'current'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[2], 'worst'));

    document.body.appendChild(slotHighlightCard);
  }

  // Call updateSlotHighlightCard whenever the bonus list or payouts change
  function patchSlotHighlightCardUpdates() {
    // After adding a bonus
    if (betSizeInput && slotNameInput && bonusListUl) {
      betSizeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateSlotHighlightCard, 50);
        }
      });
    }
    // After payout is set
    const origSetBonusPayout = setBonusPayout;
    setBonusPayout = function(slotName, payout) {
      origSetBonusPayout(slotName, payout);
      setTimeout(updateSlotHighlightCard, 50);
    };
    // On page load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updateSlotHighlightCard, 100);
    });
    // Also update when BO button is toggled
    const boBtn = document.getElementById('bo-btn');
    if (boBtn) {
      boBtn.addEventListener('click', () => {
        setTimeout(updateSlotHighlightCard, 50);
      });
    }
  }
  patchSlotHighlightCardUpdates();

  // --- Edit Slots Panel Logic ---
  const editSlotsBtn = document.getElementById('edit-slots-btn');
  let editSlotsPanel = null;

  function getBonusListUl() {
    return document.querySelector('.bonus-list ul');
  }

  function showEditSlotsPanel() {
    if (editSlotsPanel) return;
    const bonusListUl = getBonusListUl();
    if (!bonusListUl) return;
    // Only original items (not clones)
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          li,
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          img: li.querySelector('img') ? li.querySelector('img').src : ''
        };
      });

    // Create panel
    editSlotsPanel = document.createElement('div');
    editSlotsPanel.className = 'middle-panel';
    editSlotsPanel.style.display = 'flex';
    editSlotsPanel.style.flexDirection = 'column';
    editSlotsPanel.style.alignItems = 'center';
    editSlotsPanel.style.position = 'fixed';
    editSlotsPanel.style.top = '50%';
    editSlotsPanel.style.left = '50%';
    editSlotsPanel.style.transform = 'translate(-50%, -50%)';
    editSlotsPanel.style.zIndex = '1002';
    editSlotsPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    editSlotsPanel.style.borderRadius = '24px';
    editSlotsPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    editSlotsPanel.style.padding = '2rem 1.5rem';
    editSlotsPanel.style.width = '440px';
    editSlotsPanel.style.maxHeight = '480px';
    editSlotsPanel.style.overflowY = 'auto';

    // Build slot list with bin icon
    let html = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">Edit Slots</div>
      <form id="edit-slots-form" style="width:100%;">
        <div id="edit-slots-list" style="display:flex;flex-direction:column;gap:1.1rem;">
    `;
    bonuses.forEach((bonus, idx) => {
      html += `
        <div class="edit-slot-row" style="display:flex;align-items:center;gap:0.7rem;" data-idx="${idx}">
          <img src="${bonus.img}" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:8px;box-shadow:0 1px 4px 0 rgba(0,0,0,0.13);">
          <input type="text" class="middle-input" style="width:120px;" value="${bonus.name.replace(/"/g, '&quot;')}" data-idx="${idx}" data-type="name" />
          <input type="number" class="middle-input" style="width:90px;" value="${bonus.bet}" min="0" step="any" data-idx="${idx}" data-type="bet" />
          <button type="button" class="delete-slot-btn" title="Delete slot" style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
            <span style="font-size:1.5rem;color:#ff5c5c;">🗑️</span>
          </button>
        </div>
      `;
    });
    html += `
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;margin-top:2.2rem;">
          <button type="submit" class="middle-btn small-btn" style="width:120px;">Save</button>
          <button type="button" id="close-edit-slots-btn" class="middle-btn small-btn" style="width:120px;background:#ff5c5c;color:#fff;">Close</button>
        </div>
      </form>
    `;
    editSlotsPanel.innerHTML = html;
    document.body.appendChild(editSlotsPanel);

    // Delete slot logic
    editSlotsPanel.querySelectorAll('.delete-slot-btn').forEach((btn, i) => {
      btn.addEventListener('click', function() {
        // Remove from DOM
        const row = btn.closest('.edit-slot-row');
        if (row) row.remove();
        // Remove from bonus list UI
        if (bonuses[i] && bonuses[i].li && bonuses[i].li.parentNode) {
          bonuses[i].li.parentNode.removeChild(bonuses[i].li);
        }
        renderBonusHuntResults();
        updateBonusListCarousel();
        setTimeout(updateSlotHighlightCard, 50);
      });
    });

    // Save handler
    editSlotsPanel.querySelector('#edit-slots-form').onsubmit = function(e) {
      e.preventDefault();
      // Get all input values
      const nameInputs = editSlotsPanel.querySelectorAll('input[data-type="name"]');
      const betInputs = editSlotsPanel.querySelectorAll('input[data-type="bet"]');
      nameInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        // Only update if the row still exists (not deleted)
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[0]) spans[0].textContent = input.value;
        }
      });
      betInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[1]) spans[1].textContent = '€' + (parseFloat(input.value) || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
        }
      });
      renderBonusHuntResults();
      updateBonusListCarousel();
      setTimeout(updateSlotHighlightCard, 50);
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };

    // Close handler
    editSlotsPanel.querySelector('#close-edit-slots-btn').onclick = function() {
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };
  }

  if (editSlotsBtn) {
    editSlotsBtn.addEventListener('click', () => {
      showEditSlotsPanel();
    });
  }
});

// Set your fallback slot image here:
const DEFAULT_SLOT_IMAGE = 'https://i.imgur.com/8E3ucNx.png';
