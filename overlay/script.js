document.addEventListener('DOMContentLoaded', function() {
  // --- Carousel rotation variables ---
  let carouselIndex = 0;
  let carouselInterval = null;

  // Mode options logic
  const modeOptions = ["WAGGER", "RAW", "C.BALANCE"];
  let modeIndex = 0;
  const modeText = document.getElementById('mode-text');
  const modeSection = document.getElementById('mode-section');

  if (modeSection && modeText) {
    modeSection.addEventListener('click', () => {
      modeIndex = (modeIndex + 1) % modeOptions.length;
      modeText.textContent = modeOptions[modeIndex];
    });
    modeText.textContent = modeOptions[modeIndex];
  }

  // Editable section logic
  const editableSection = document.getElementById('editable-section');
  const editableText = document.getElementById('editable-text');
  if (editableSection && editableText) {
    editableSection.addEventListener('click', function () {
      if (editableSection.querySelector('input')) return;
      const currentText = editableText.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.style.fontSize = '18px';
      input.style.fontWeight = 'bold';
      input.style.width = (currentText.length + 2) + 'ch';
      editableSection.replaceChild(input, editableText);
      input.focus();
      function save() {
        editableText.textContent = input.value || ' ';
        editableSection.replaceChild(editableText, input);
      }
      input.addEventListener('blur', save);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') save();
      });
    });
  }

  // Make twitch section editable
  const twitchSection = document.getElementById('twitch-section');
  const twitchText = document.getElementById('twitch-text');
  if (twitchSection && twitchText) {
    twitchSection.addEventListener('click', function (e) {
      if (twitchSection.querySelector('input') || e.target.tagName === 'I') return;
      const currentText = twitchText.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.style.fontSize = '16px';
      input.style.fontWeight = 'bold';
      input.style.width = (currentText.length + 2) + 'ch';
      twitchSection.replaceChild(input, twitchText);
      input.focus();
      function save() {
        twitchText.textContent = input.value || ' ';
        twitchSection.replaceChild(twitchText, input);
      }
      input.addEventListener('blur', save);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') save();
      });
    });
  }

  // Icon group highlight logic
  const iconGroup = document.querySelector('.icon-group');
  if (iconGroup) {
    const icons = iconGroup.querySelectorAll('i');
    icons.forEach(icon => {
      icon.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
      });
    });
    if (icons.length > 0) icons[0].classList.add('active');
  }

  // Date and time logic
  function updateDateTime() {
    const dtElem = document.getElementById('datetime-section');
    if (!dtElem) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB');
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    dtElem.textContent = `${dateStr} ${timeStr}`;
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // Sidebar and hunt controls toggle logic (MAGNIFIER ONLY)
  const sidebar = document.getElementById('sidebar');
  const magnifier = document.querySelector('.fa-magnifying-glass');
  if (sidebar && magnifier) {
    magnifier.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });
  }

  // --- Bonus Hunt Tracker Controls Logic with Suggestions and Bet ---
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
    { name: "Book of Eye", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.onlyplay-BookofEye_designed.jpg", provider: "Only Play " }
  ];
  let slots = [];
  const slotSearch = document.getElementById('slotSearch');
  const slotBet = document.getElementById('slotBet');
  const addSlotBtn = document.getElementById('addSlotBtn');
  const slotSuggestions = document.getElementById('slotSuggestions');
  const totalBonuses = document.getElementById('totalBonuses');
  const huntSlotList = document.getElementById('huntSlotList');
  const toggleEditSlotsBtn = document.getElementById('toggleEditSlotsBtn');
  const startMoney = document.getElementById('startMoney');
  const finishMoney = document.getElementById('finishMoney');
  const superCheckbox = document.getElementById('superCheckbox');
  const slotImageUrl = document.getElementById('slotImageUrl');
  const discordBannerUrl = document.getElementById('discordBannerUrl');
  const setDiscordBannerBtn = document.getElementById('setDiscordBannerBtn');
  const sidebarBannerImageContainer = document.getElementById('sidebarBannerImageContainer');
  const sidebarBannerImage = document.getElementById('sidebarBannerImage');
  const showSlotUrlBtn = document.getElementById('showSlotUrlBtn');

  // Defensive: Only add event listeners if elements exist
  if (showSlotUrlBtn && slotImageUrl) {
    showSlotUrlBtn.addEventListener('click', function() {
      slotImageUrl.style.display = slotImageUrl.style.display === 'none' ? 'block' : 'none';
      if (slotImageUrl.style.display === 'block') slotImageUrl.focus();
    });
    // Hide slotImageUrl input after use
    slotImageUrl.addEventListener('blur', function() {
      slotImageUrl.style.display = 'none';
    });
    slotImageUrl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') slotImageUrl.blur();
    });
  }

  // --- Bonus Hunt Tracker Controls Logic with Suggestions and Bet ---
  let slots = [];
  const slotSearch = document.getElementById('slotSearch');
  const slotBet = document.getElementById('slotBet');
  const addSlotBtn = document.getElementById('addSlotBtn');
  const slotSuggestions = document.getElementById('slotSuggestions');
  const totalBonuses = document.getElementById('totalBonuses');
  const huntSlotList = document.getElementById('huntSlotList');
  const toggleEditSlotsBtn = document.getElementById('toggleEditSlotsBtn');
  const startMoney = document.getElementById('startMoney');
  const finishMoney = document.getElementById('finishMoney');
  const superCheckbox = document.getElementById('superCheckbox');
  const slotImageUrl = document.getElementById('slotImageUrl');
  const discordBannerUrl = document.getElementById('discordBannerUrl');
  const setDiscordBannerBtn = document.getElementById('setDiscordBannerBtn');
  const sidebarBannerImageContainer = document.getElementById('sidebarBannerImageContainer');
  const sidebarBannerImage = document.getElementById('sidebarBannerImage');
  const showSlotUrlBtn = document.getElementById('showSlotUrlBtn');

  // Defensive: Only add event listeners if elements exist
  if (showSlotUrlBtn && slotImageUrl) {
    showSlotUrlBtn.addEventListener('click', function() {
      slotImageUrl.style.display = slotImageUrl.style.display === 'none' ? 'block' : 'none';
      if (slotImageUrl.style.display === 'block') slotImageUrl.focus();
    });
    // Hide slotImageUrl input after use
    slotImageUrl.addEventListener('blur', function() {
      slotImageUrl.style.display = 'none';
    });
    slotImageUrl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') slotImageUrl.blur();
    });
  }

  // --- Sidebar Stats Logic ---
  function updateSidebarStats() {
    const sidebarAvg = document.getElementById('sidebarAvg');
    const sidebarBE = document.getElementById('sidebarBE');
    const sidebarProfit = document.getElementById('sidebarProfit');
    const sidebarTarget = document.getElementById('sidebarTarget');
    const sidebarProgressBar = document.getElementById('sidebarProgressBar');
    const sidebarProgressText = document.getElementById('sidebarProgressText');
    const start = parseFloat(startMoney.value) || 0;
    const finish = parseFloat(finishMoney.value) || 0;
    const totalBet = slots.reduce((acc, s) => acc + (s.bet || 0), 0);
    let be = totalBet > 0 ? start / totalBet : 0;
    sidebarBE.textContent = be ? be.toFixed(2) + "x" : "0x";
    let avg = totalBet > 0 ? finish / totalBet : 0;
    sidebarAvg.textContent = avg ? avg.toFixed(2) + "x" : "0x";
    let profit = finish - start;
    sidebarProfit.textContent = profit.toFixed(2) + "€";
    sidebarProfit.style.color = profit > 0 ? "#3ec6ff" : (profit < 0 ? "#ff3e3e" : "#fff");
    sidebarTarget.textContent = start.toFixed(2) + "€";
    let progress = be > 0 ? Math.min((avg / be) * 100, 100) : 0;
    sidebarProgressBar.style.width = progress + "%";
    sidebarProgressText.textContent = progress ? progress.toFixed(0) + "%" : "0%";
  }
  function updateProfit() {
    // Dummy function for compatibility
  }
  if (startMoney) startMoney.addEventListener('input', function() {
    updateProfit();
    updateSidebarStats();
  });
  if (finishMoney) finishMoney.addEventListener('input', function() {
    updateProfit();
    updateSidebarStats();
  });

  // Show suggestions as you type
  if (slotSearch) {
    slotSearch.addEventListener('input', function() {
      const query = slotSearch.value.trim().toLowerCase();
      slotSuggestions.innerHTML = '';
      if (query.length >= 3) {
        const matches = slotDatabase.filter(slot => slot.name.toLowerCase().includes(query));
        if (matches.length) {
          slotSuggestions.style.display = 'block';
          matches.forEach(slot => {
            const div = document.createElement('div');
            div.className = 'slot-suggestion-item';
            div.innerHTML = `
              <img src="${slot.image}" alt="${slot.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;">
              <span style="font-weight:bold;">${slot.name}</span>
              <span style="font-size:0.9em;color:#7ec6ff;margin-left:6px;">${slot.provider || ''}</span>
            `;
            div.addEventListener('mousedown', function(e) {
              slotSearch.value = slot.name;
              slotSuggestions.style.display = 'none';
            });
            slotSuggestions.appendChild(div);
          });
        } else {
          slotSuggestions.style.display = 'none';
        }
      } else {
        slotSuggestions.style.display = 'none';
      }
    });
    slotSearch.addEventListener('blur', function() {
      setTimeout(() => slotSuggestions && (slotSuggestions.style.display = 'none'), 100);
    });
    if (addSlotBtn) {
      slotSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && addSlotBtn) addSlotBtn.click();
      });
    }
  }
  if (slotBet) {
    slotBet.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && addSlotBtn) addSlotBtn.click();
    });
  }
  if (addSlotBtn) {
    addSlotBtn.addEventListener('click', function() {
      const name = slotSearch.value.trim();
      const bet = parseFloat(slotBet.value);
      const isSuper = superCheckbox.checked;
      const customImage = slotImageUrl.value.trim();
      if (!name || isNaN(bet) || bet <= 0) {
        slotSearch.style.boxShadow = "0 0 0 2px #ff3e3e";
        slotBet.style.boxShadow = "0 0 0 2px #ff3e3e";
        setTimeout(() => {
          slotSearch.style.boxShadow = "";
          slotBet.style.boxShadow = "";
        }, 600);
        return;
      }
      const slotObj = slotDatabase.find(slot => slot.name === name);
      slots.push({
        name,
        bet,
        image: customImage || (slotObj ? slotObj.image : ''),
        provider: slotObj ? slotObj.provider : '',
        super: isSuper
      });
      slotSearch.value = "";
      slotBet.value = "";
      slotImageUrl.value = "";
      superCheckbox.checked = false;
      carouselIndex = 0;
      updateBonusList();
    });
  }
  if (toggleEditSlotsBtn && huntSlotList) {
    toggleEditSlotsBtn.addEventListener('click', function() {
      if (huntSlotList.style.display === 'none' || huntSlotList.style.display === '') {
        huntSlotList.style.display = 'flex';
        toggleEditSlotsBtn.textContent = 'Hide Edit Slots';
      } else {
        huntSlotList.style.display = 'none';
        toggleEditSlotsBtn.textContent = 'Edit Slots';
      }
    });
  }

  // --- Carousel rotation logic ---
  function startCarouselRotation() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      if (slots.length > 0) {
        animateCarouselToIndex((carouselIndex + 1) % slots.length);
      }
    }, 2500);
  }

  // --- Smooth carousel animation ---
  let isCarouselAnimating = false;
  function animateCarouselToIndex(newIndex) {
    if (isCarouselAnimating || newIndex === carouselIndex) return;
    const bonus3dCarousel = document.getElementById('bonus3dCarousel');
    const track = bonus3dCarousel.querySelector('.card-3d-track');
    if (!track) {
      carouselIndex = newIndex;
      updateBonusList(false);
      return;
    }
    isCarouselAnimating = true;
    const slotWidth = 120;
    const gap = 0;
    const containerWidth = 360;
    const currentOffset = (containerWidth / 2) - (slotWidth / 2) - (carouselIndex * (slotWidth + gap));
    const nextOffset = (containerWidth / 2) - (slotWidth / 2) - (newIndex * (slotWidth + gap));
    track.style.transition = 'transform 0.7s cubic-bezier(.22,1,.36,1)';
    track.style.transform = `translateX(${nextOffset}px)`;
    setTimeout(() => {
      carouselIndex = newIndex;
      updateBonusList(false); // re-render to update active class
      isCarouselAnimating = false;
    }, 700);
  }

  // --- Update both sidebar and hunt control panel slot list ---
  function updateBonusList(restartInterval = true) {
    // 3D Carousel for Bonus List
    const bonus3dCarousel = document.getElementById('bonus3dCarousel');
    bonus3dCarousel.innerHTML = '';
    const n = slots.length;
    const visibleSlots = 3; // always show 3 (centered)
    const slotWidth = 120;
    const gap = 0;
    const track = document.createElement('div');
    track.className = 'card-3d-track';
    track.style.width = `${n * slotWidth}px`;

    if (n > 0) {
      for (let i = 0; i < n; i++) {
        const slot = slots[i];
        const div = document.createElement('div');
        div.className = 'card-3d-slot' + (i === carouselIndex ? ' active' : '');
        div.innerHTML = `
          <img class="card-3d-img${slot.super ? ' super-glow' : ''}" src="${slot.image}" alt="${slot.name}">
          <div class="card-3d-bet${slot.super ? ' super-vibrate' : ''}">€${slot.bet.toFixed(2)}</div>
        `;
        div.title = slot.name;
        track.appendChild(div);
      }
      // Center the active card
      const containerWidth = 360; // .card-3d width
      const offset = (containerWidth / 2) - (slotWidth / 2) - (carouselIndex * (slotWidth + gap));
      track.style.transform = `translateX(${offset}px)`;
      track.style.transition = isCarouselAnimating ? 'transform 0.7s cubic-bezier(.22,1,.36,1)' : '';
    } else {
      for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.className = 'card-3d-slot';
        div.style.background = '#232b3e';
        div.style.border = '2px dashed #3ec6ff22';
        track.appendChild(div);
      }
      track.style.transform = `translateX(0px)`;
    }
    bonus3dCarousel.appendChild(track);

    // Best & Worst Slot logic
    const bestSlotDiv = document.getElementById('sidebarBestSlot');
    const worstSlotDiv = document.getElementById('sidebarWorstSlot');
    let best = null, worst = null;
    slots.forEach(slot => {
      if (typeof slot.paid === "number" && slot.bet > 0) {
        const x = slot.paid / slot.bet;
        if (!best || x > best.x) best = { ...slot, x };
        if (!worst || x < worst.x) worst = { ...slot, x };
      }
    });

    // NEW slotBoxHTML: no name, bigger image, pills for bet, paid, x
    function slotBoxHTML(slot, label, cardClass) {
      return `
        <div class="${cardClass}" style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div class="slot-img-wrapper">
            <div class="slot-pills-top">
              <span class="slot-bet-pill">€${slot.bet.toFixed(2)}</span>
              <span class="slot-x-pill">${slot.x?.toFixed(2) ?? "0.00"}x</span>
            </div>
            <img class="slot-img" src="${slot.image}" alt="">
            <span class="slot-paid-pill">€${slot.paid !== undefined ? Number(slot.paid).toFixed(2) : "0.00"}</span>
          </div>
          <div class="slot-label" style="margin-top:8px;">${label}</div>
        </div>
      `;
    }

    bestSlotDiv.innerHTML = best ? slotBoxHTML(best, "Best", "slot-best-card") : '<span style="color:#aaa;">No data</span>';
    worstSlotDiv.innerHTML = worst ? slotBoxHTML(worst, "Worst", "slot-worst-card") : '<span style="color:#aaa;">No data</span>';

    // Hunt control panel list (single row)
    huntSlotList.innerHTML = '';
    slots.forEach((slot, idx) => {
      const row = document.createElement('div');
      row.className = 'hunt-slot-row';
      row.innerHTML = `
        <span style="flex:1;">${slot.name} (€${slot.bet.toFixed(2)})</span>
        <button class="edit-slot-btn" title="Edit">✏️</button>
        <button class="delete-slot-btn" title="Delete">🗑️</button>
      `;
      row.querySelector('.edit-slot-btn').onclick = function() {
        const newName = prompt("Edit slot name:", slot.name);
        if (newName !== null && newName.trim() !== "") slot.name = newName.trim();
        const newBet = prompt("Edit bet (€):", slot.bet);
        if (newBet !== null && !isNaN(parseFloat(newBet))) slot.bet = parseFloat(newBet);
        updateBonusList();
      };
      row.querySelector('.delete-slot-btn').onclick = function() {
        if (confirm("Remove this slot?")) {
          slots.splice(idx, 1);
          carouselIndex = 0; // Reset carousel to start
          updateBonusList();
        }
      };
      huntSlotList.appendChild(row);
    });
    totalBonuses.textContent = slots.length + " Bonuses";
    updateSidebarStats();
    if (restartInterval) startCarouselRotation();
  }

  // --- Slot Opener Logic ---
  const finishHuntBtn = document.getElementById('finishHuntBtn');
  const slotOpenerPanel = document.getElementById('slotOpenerPanel');
  const slotOpenerSlotInfo = document.getElementById('slotOpenerSlotInfo');
  const slotOpenerPayInput = document.getElementById('slotOpenerPayInput');
  const slotOpenerNextBtn = document.getElementById('slotOpenerNextBtn');
  const slotOpenerProgress = document.getElementById('slotOpenerProgress');
  let slotOpenIndex = 0;

  // --- FIX: Hide slot opener panel on page load ---
  slotOpenerPanel.style.display = "none";
  // Also ensure huntControls is defined
  const huntControls = document.getElementById('bonus-hunt-controls');

  if (finishHuntBtn && slotOpenerPanel && huntControls) {
    finishHuntBtn.addEventListener('click', function() {
      if (slots.length === 0) {
        alert("No slots to open!");
        return;
      }
      huntControls.classList.add('hide');
      slotOpenerPanel.style.display = "block";
      slotOpenIndex = 0;
      slots.forEach(s => delete s.paid); // Reset paid values
      showSlotOpener();
    });
  }

  function showSlotOpener() {
    if (slotOpenIndex >= slots.length) {
      slotOpenerPanel.style.display = "none";
      huntControls.classList.remove('hide'); // Show controls again
      updateSidebarStats();
      updateBonusList();
      return;
    }
    const slot = slots[slotOpenIndex];
    const paid = slot.paid !== undefined ? slot.paid : "";
    const x = (slot.paid && slot.bet) ? (slot.paid / slot.bet) : 0;
    slotOpenerSlotInfo.innerHTML = `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <span class="slot-bet-pill">€${slot.bet.toFixed(2)}</span>
        <span class="slot-paid-pill">Paid: €${paid !== "" ? Number(paid).toFixed(2) : "0.00"}</span>
        <span class="slot-x-pill">${x ? x.toFixed(2) : "0.00"}x</span>
        <img src="${slot.image}" alt="${slot.name}" class="slot-img" style="width:500px;height:500px;object-fit:contain;display:block;">
      </div>
      <div style="margin-top:8px;color:#3ec6ff;font-size:1.2em;font-weight:bold;">${slot.name}</div>
      <div style="color:#7ec6ff;font-size:1em;">${slot.provider || ""}</div>
    `;
    slotOpenerPayInput.value = paid;
    slotOpenerPayInput.focus();
    slotOpenerProgress.textContent = `Slot ${slotOpenIndex + 1} of ${slots.length}`;
  }

  // Only add these listeners ONCE!
  if (slotOpenerNextBtn && slotOpenerPayInput) {
    slotOpenerNextBtn.addEventListener('click', function() {
      const val = parseFloat(slotOpenerPayInput.value);
      if (isNaN(val) || val < 0) {
        slotOpenerPayInput.style.boxShadow = "0 0 0 2px #ff3e3e";
        setTimeout(() => slotOpenerPayInput.style.boxShadow = "", 600);
        return;
      }
      slots[slotOpenIndex].paid = val;
      slotOpenIndex++;
      const paidSum = slots.reduce((acc, s) => acc + (s.paid || 0), 0);
      finishMoney.value = paidSum.toFixed(2);
      updateProfit();
      updateSidebarStats();
      updateBonusList();
      showSlotOpener();
    });
    slotOpenerPayInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') slotOpenerNextBtn.click();
    });
  }

  // Discord Banner logic (FIXED)
  if (setDiscordBannerBtn && discordBannerUrl && sidebarBannerImage && sidebarBannerImageContainer) {
    setDiscordBannerBtn.addEventListener('click', function() {
      // Toggle input visibility
      if (discordBannerUrl.style.display === 'none' || !discordBannerUrl.style.display) {
        discordBannerUrl.style.display = 'block';
        discordBannerUrl.focus();
        return;
      }
      // If input is visible, set the banner
      const url = discordBannerUrl.value.trim();
      if (url) {
        sidebarBannerImage.src = url;
        sidebarBannerImageContainer.style.display = "block";
      } else {
        sidebarBannerImage.src = "";
        sidebarBannerImageContainer.style.display = "none";
      }
      discordBannerUrl.style.display = 'none';
    });
  }

  // --- Tournament Bracket & Setup Logic ---
  // Only declare each variable ONCE!
  const peopleArrowsIcon = document.querySelector('.fa-people-arrows');
  const tournamentBracketPanel = document.getElementById('tournamentBracketPanel');
  const quarterMatchesDiv = document.getElementById('quarterMatches');
  const semiMatchesDiv = document.getElementById('semiMatches');
  const finalMatchDiv = document.getElementById('finalMatch');
  const tournamentSetupPanel = document.getElementById('tournamentSetupPanel');
  const tournamentSetupRows = document.getElementById('tournamentSetupRows');
  const startTournamentBtn = document.getElementById('startTournamentBtn');
  const openMatchControlBtn = document.getElementById('openMatchControlBtn');
  const tournamentMatchControl = document.getElementById('tournamentMatchControl');
  const matchControlPlayers = document.getElementById('matchControlPlayers');
  const matchControlBtn1 = document.getElementById('matchControlBtn1');
  const matchControlBtn2 = document.getElementById('matchControlBtn2');
  const matchControlPhase = document.getElementById('matchControlPhase');
  const closeMatchControlBtn = document.getElementById('closeMatchControlBtn');

  (function() {
    const panel = document.getElementById('tournamentMatchControl');
    const handle = document.getElementById('matchControlDragHandle');
    if (!panel || !handle) return;
    let offsetX = 0, offsetY = 0, isDragging = false;

    handle.addEventListener('mousedown', function(e) {
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.transform = 'none';
      panel.style.position = 'fixed';
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
      document.body.style.userSelect = '';
    });
  })();
  
  // Helper to get current phase and match index
  function getCurrentMatch() {
    if (!isPhaseComplete(bracket.quarters)) {
      // Find first incomplete quarter match
      const idx = bracket.quarters.findIndex(m => m.winner === null);
      return { phase: 'quarters', idx, match: bracket.quarters[idx] };
    } else if (!isPhaseComplete(bracket.semis)) {
      const idx = bracket.semis.findIndex(m => m.winner === null);
      return { phase: 'semis', idx, match: bracket.semis[idx] };
    } else {
      return { phase: 'final', idx: 0, match: bracket.final };
    }
  }

  if (openMatchControlBtn) {
    openMatchControlBtn.addEventListener('click', function() {
      const { phase, idx, match } = getCurrentMatch();
      if (!match) {
        alert("No match to control!");
        return;
      }
      tournamentMatchControl.style.display = 'block';
      // Get player names
      const p1Name = tournamentPlayers[match.p1]?.name || '';
      const p2Name = tournamentPlayers[match.p2]?.name || '';
      matchControlPlayers.textContent = `${p1Name} vs ${p2Name}`;
      matchControlBtn1.textContent = `${p1Name} +1`;
      matchControlBtn2.textContent = `${p2Name} +1`;
      matchControlPhase.textContent = `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}${phase !== 'final' ? ' Match ' + (idx + 1) : ''}`;
      // Store for click handlers
      matchControlBtn1.onclick = function() {
        window.updateScore(phase, idx, 1);
        openMatchControlBtn.click(); // Refresh panel
      };
      matchControlBtn2.onclick = function() {
        window.updateScore(phase, idx, 2);
        openMatchControlBtn.click(); // Refresh panel
      };
    });
  }
  if (closeMatchControlBtn && tournamentMatchControl) {
    closeMatchControlBtn.addEventListener('click', function() {
      tournamentMatchControl.style.display = 'none';
    });
  }

  // Tournament players for setup (editable)
  let tournamentPlayers = [
    { name: "Player 1", slot: "" },
    { name: "Player 2", slot: "" },
    { name: "Player 3", slot: "" },
    { name: "Player 4", slot: "" },
    { name: "Player 5", slot: "" },
    { name: "Player 6", slot: "" },
    { name: "Player 7", slot: "" },
    { name: "Player 8", slot: "" }
  ];

  // Tournament state
  let bracket = {
    quarters: [
      {p1: 0, p2: 1, score1: 0, score2: 0, winner: null},
      {p1: 2, p2: 3, score1: 0, score2: 0, winner: null},
      {p1: 4, p2: 5, score1: 0, score2: 0, winner: null},
      {p1: 6, p2: 7, score1: 0, score2: 0, winner: null}
    ],
    semis: [
      {p1: null, p2: null, score1: 0, score2: 0, winner: null},
      {p1: null, p2: null, score1: 0, score2: 0, winner: null}
    ],
    final: {p1: null, p2: null, score1: 0, score2: 0, winner: null}
  };

  // Helper for bracket display names
  function getBracketPlayerName(idx) {
    if (window.tournamentPlayers && window.tournamentPlayers[idx]) return window.tournamentPlayers[idx];
    if (tournamentPlayers[idx]) {
      let p = tournamentPlayers[idx];
      return p.name + (p.slot ? " (" + p.slot + ")" : "");
    }
    return "Player " + (idx + 1);
  }

  // Get slot data by name
  function getSlotData(slotName) {
    return slotDatabase.find(s => s.name === slotName) || {};
  }

  // Bracket slot card HTML
  function bracketSlotCard(playerName, slotName) {
    const slot = getSlotData(slotName);
    return `
      <div style="
        background: #181926;
        border-radius: 12px;
        box-shadow: 0 0 18px #3ec6ff88;
        padding: 0;
        margin: 8px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 120px;
        max-width: 140px;
        border: 2px solid #3ec6ff;
        overflow: hidden;
        height: 140px;
        position: relative;
        ">
        <img src="${slot.image || 'https://via.placeholder.com/140x140/232b3e/3ec6ff?text=?'}"
             alt=""
             style="width:100%;height:100%;object-fit:cover;display:block;">
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(24,25,38,0.85);
          color: #3ec6ff;
          font-weight: bold;
          text-align: center;
          font-size: 1em;
          padding: 2px 0 0 0;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        ">${playerName || '?'}<br><span style="font-size:0.9em;color:#7ec6ff;">${slotName || ''}</span></div>
      </div>
    `;
  }

  // Render bracket
  function renderBracket() {
    // Helper to get highlight class
    function getHighlightClass(match, side) {
      if (match.winner === null) return '';
      if (side === 1 && match.winner === match.p1) return 'bracket-winner';
      if (side === 2 && match.winner === match.p2) return 'bracket-winner';
      if (side === 1 && match.winner === match.p2) return 'bracket-loser';
      if (side === 2 && match.winner === match.p1) return 'bracket-loser';
      return '';
    }

    // Hide all phases by default
    quarterMatchesDiv.parentElement.style.display = 'none';
    semiMatchesDiv.parentElement.style.display = 'none';
    finalMatchDiv.parentElement.style.display = 'none';

    // Quarters
    if (!isPhaseComplete(bracket.quarters)) {
      quarterMatchesDiv.parentElement.style.display = '';
      quarterMatchesDiv.innerHTML = '';
      bracket.quarters.forEach((m, i) => {
        const p1Name = tournamentPlayers[m.p1]?.name || '';
        const p1Slot = tournamentPlayers[m.p1]?.slot || '';
        const p2Name = tournamentPlayers[m.p2]?.name || '';
        const p2Slot = tournamentPlayers[m.p2]?.slot || '';
        quarterMatchesDiv.innerHTML += `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
            <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
            <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
          </div>
        `;
      });
    } else if (!isPhaseComplete(bracket.semis)) {
      semiMatchesDiv.parentElement.style.display = '';
      semiMatchesDiv.innerHTML = '';
      bracket.semis.forEach((m, i) => {
        const p1Name = tournamentPlayers[m.p1]?.name || '';
        const p1Slot = tournamentPlayers[m.p1]?.slot || '';
        const p2Name = tournamentPlayers[m.p2]?.name || '';
        const p2Slot = tournamentPlayers[m.p2]?.slot || '';
        semiMatchesDiv.innerHTML += `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
            <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
            <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
          </div>
        `;
      });
    } else {
      finalMatchDiv.parentElement.style.display = '';
      finalMatchDiv.innerHTML = '';
      const m = bracket.final;
      const p1Name = tournamentPlayers[m.p1]?.name || '';
      const p1Slot = tournamentPlayers[m.p1]?.slot || '';
      const p2Name = tournamentPlayers[m.p2]?.name || '';
      const p2Slot = tournamentPlayers[m.p2]?.slot || '';
      finalMatchDiv.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
          <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
          <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
        </div>
      `;
    }

    // Add event listeners for score inputs if needed
    setTimeout(() => {
      document.querySelectorAll('.bracket-score-input').forEach(input => {
        input.addEventListener('change', function() {
          const matchIdx = +this.dataset.match;
          const side = +this.dataset.side;
          const val = Math.max(0, parseInt(this.value) || 0);
          if (!isPhaseComplete(bracket.quarters)) {
            if (side === 1) bracket.quarters[matchIdx].score1 = val;
            if (side === 2) bracket.quarters[matchIdx].score2 = val;
          } else if (!isPhaseComplete(bracket.semis)) {
            if (side === 1) bracket.semis[matchIdx].score1 = val;
            if (side === 2) bracket.semis[matchIdx].score2 = val;
          } else {
            if (side === 1) bracket.final.score1 = val;
            if (side === 2) bracket.final.score2 = val;
          }
          renderBracket();
        });
      });
    }, 0);
  }

  // Score update logic (best of 3)
  window.updateScore = function(round, idx, player) {
    let match;
    if (round === 'quarters') match = bracket.quarters[idx];
    if (round === 'semis') match = bracket.semis[idx];
    if (round === 'final') match = bracket.final;
    if (!match) return;
    if (player === 1) match.score1++;
    if (player === 2) match.score2++;
    // Best of 3 logic
    if (match.score1 === 2) {
      match.winner = match.p1;
      match.score1 = 2; match.score2 = Math.min(match.score2, 1);
    }
    if (match.score2 === 2) {
      match.winner = match.p2;
      match.score2 = 2; match.score1 = Math.min(match.score1, 1);
    }
    // Advance winners
    if (round === 'quarters') {
      bracket.semis[Math.floor(idx/2)][idx%2 === 0 ? 'p1' : 'p2'] = match.winner;
    }
    if (round === 'semis') {
      bracket.final[idx === 0 ? 'p1' : 'p2'] = match.winner;
    }
    renderBracket();
  };

  // Tournament setup panel rendering
  function renderTournamentSetup() {
    tournamentSetupRows.innerHTML = "";
    tournamentPlayers.forEach((player, i) => {
      tournamentSetupRows.innerHTML += `
        <tr>
          <td style="color:#3ec6ff;font-family:'Orbitron',monospace;">${i+1}</td>
          <td>
            <input class="tournament-player-input" id="playerNameInput${i}" value="${player.name}" autocomplete="off">
          </td>
          <td style="position:relative;">
            <input class="tournament-slot-input" id="playerSlotInput${i}" value="${player.slot}" placeholder="Search slot..." autocomplete="off">
            <div class="tournament-slot-suggestions" id="slotSuggestions${i}" style="display:none;"></div>
          </td>
        </tr>
      `;
    });

    // Add listeners for name and slot search
    tournamentPlayers.forEach((player, i) => {
      const nameInput = document.getElementById(`playerNameInput${i}`);
      nameInput.addEventListener('input', e => {
        tournamentPlayers[i].name = nameInput.value;
      });

      const slotInput = document.getElementById(`playerSlotInput${i}`);
      const suggestionsDiv = document.getElementById(`slotSuggestions${i}`);
      slotInput.addEventListener('input', function() {
        const query = slotInput.value.trim().toLowerCase();
        suggestionsDiv.innerHTML = '';
        if (query.length >= 2) {
          const matches = slotDatabase.filter(slot => slot.name.toLowerCase().includes(query));
          if (matches.length) {
            suggestionsDiv.style.display = 'block';
            matches.forEach(slot => {
              const div = document.createElement('div');
              div.className = 'tournament-slot-suggestion-item';
              div.innerHTML = `<img src="${slot.image}" alt="${slot.name}" style="width:28px;height:28px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;">
                <span style="font-weight:bold;">${slot.name}</span>
                <span style="font-size:0.9em;color:#7ec6ff;margin-left:6px;">${slot.provider || ''}</span>`;
              div.addEventListener('mousedown', function(e) {
                slotInput.value = slot.name;
                tournamentPlayers[i].slot = slot.name;
                suggestionsDiv.style.display = 'none';
              });
              suggestionsDiv.appendChild(div);
            });
          } else {
            suggestionsDiv.style.display = 'none';
          }
        } else {
          suggestionsDiv.style.display = 'none';
        }
      });
      slotInput.addEventListener('blur', function() {
        setTimeout(() => suggestionsDiv.style.display = 'none', 100);
      });
      slotInput.addEventListener('input', function() {
        tournamentPlayers[i].slot = slotInput.value;
      });
    });
  }

  // Show setup panel when clicking people arrows
  if (peopleArrowsIcon && tournamentSetupPanel && tournamentBracketPanel) {
    peopleArrowsIcon.addEventListener('click', function() {
      // If setup panel is open, close it and slide bracket out to the left
      if (tournamentSetupPanel.style.display === 'block') {
        tournamentSetupPanel.style.display = 'none';
        if (tournamentBracketPanel.classList.contains('slide-in-right')) {
          tournamentBracketPanel.classList.remove('slide-in-right');
          tournamentBracketPanel.classList.remove('slide-out-right');
          tournamentBracketPanel.classList.add('slide-out-left');
          setTimeout(() => {
            tournamentBracketPanel.style.display = 'none';
            tournamentBracketPanel.classList.remove('slide-out-left');
          }, 700);
        } else {
          tournamentBracketPanel.style.display = 'none';
        }
      } else {
        renderTournamentSetup();
        tournamentSetupPanel.style.display = 'block';
        // If bracket is visible, slide it out to the left
        if (tournamentBracketPanel.classList.contains('slide-in-right')) {
          tournamentBracketPanel.classList.remove('slide-in-right');
          tournamentBracketPanel.classList.remove('slide-out-right');
          tournamentBracketPanel.classList.add('slide-out-left');
          setTimeout(() => {
            tournamentBracketPanel.style.display = 'none';
            tournamentBracketPanel.classList.remove('slide-out-left');
          }, 700);
        } else {
          tournamentBracketPanel.style.display = 'none';
        }
      }
    });
  }

  // When starting the tournament, animate bracket in from right
  if (startTournamentBtn && tournamentSetupPanel && tournamentBracketPanel) {
    startTournamentBtn.addEventListener('click', function() {
      for (let p of tournamentPlayers) {
        if (!p.name.trim() || !p.slot.trim()) {
          alert("Please fill all player names and slots!");
          return;
        }
      }
      tournamentSetupPanel.style.display = 'none';
      tournamentBracketPanel.style.display = 'block';
      tournamentBracketPanel.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right');
      void tournamentBracketPanel.offsetWidth;
      tournamentBracketPanel.classList.add('slide-in-right');
      renderBracket();
    });
  }

  // Helper: Check if phase is complete
  function isPhaseComplete(phase) {
    if (Array.isArray(phase)) {
      return phase.every(m => m.winner !== null);
    } else if (typeof phase === "object") {
      return phase.winner !== null;
    }
    return false;
  }

  // --- Floating Slot Picker Card Logic ---
  const floatingSlotPickerCard = document.getElementById('floatingSlotPickerCard');
  const floatingSlotPickerSpinner = document.getElementById('floatingSlotPickerSpinner');
  const cartIcon = document.querySelector('.fa-cart-shopping');
  let spinTimeout = null;

  function showFloatingSlotPicker(show = true) {
    if (floatingSlotPickerCard) floatingSlotPickerCard.style.display = show ? 'block' : 'none';
  }

  // Unified spin animation for both modal and floating card
  function unifiedSpinAnimation(slots, onDone) {
    showFloatingSlotPicker(true);
    let idx = Math.floor(Math.random() * slots.length);
    let speed = 35;
    let spins = 0;
    let maxSpins = 16 + Math.floor(Math.random() * 6);
    function showSlot(i, isFinal = false) {
      const slot = slots[i];
      if (floatingSlotPickerSpinner) {
        floatingSlotPickerSpinner.innerHTML = isFinal
          ? `<div class="floating-slot-glow"><img src="${slot.image}" alt=""></div>`
          : `<div class="floating-slot-spinning"><img src="${slot.image}" alt=""></div>`;
      }
      if (window.slotPickerSpinner) {
        window.slotPickerSpinner.innerHTML = isFinal
          ? `<div class="slot-picker-glow" style="display:flex;flex-direction:column;align-items:center;">
                <img src="${slot.image}" alt="${slot.name}" style="width:120px;height:140px;object-fit:cover;border-radius:12px;box-shadow:0 0 32px 8px #3ec6ffcc,0 0 0 4px #3ec6ff44;outline:3px solid #3ec6ff;outline-offset:2px;">
                <div style="color:#3ec6ff;font-weight:bold;font-size:1.1em;margin-top:8px;letter-spacing:1px;text-shadow:0 2px 8px #0008;">${slot.name}</div>
                <div style="color:#7ec6ff;font-size:0.95em;">${slot.provider}</div>
             </div>`
          : `<div class="slot-picker-spinning" style="display:flex;flex-direction:column;align-items:center;">
                <img src="${slot.image}" alt="${slot.name}" style="width:120px;height:140px;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px #3ec6ff88;">
                <div style="color:#3ec6ff;font-weight:bold;font-size:1.1em;margin-top:8px;letter-spacing:1px;text-shadow:0 2px 8px #0008;">${slot.name}</div>
                <div style="color:#7ec6ff;font-size:0.95em;">${slot.provider}</div>
             </div>`;
      }
    }
    function spinStep() {
      idx = (idx + 1) % slots.length;
      showSlot(idx);
      spins++;
      if (spins < maxSpins) {
        speed += 7;
        spinTimeout = setTimeout(spinStep, speed);
      } else {
        spinTimeout = null;
        showSlot(idx, true);
        if (window.slotPickerResult) window.slotPickerResult.style.display = 'none';
        if (onDone) onDone(slots[idx]);
      }
    }
    if (spinTimeout) clearTimeout(spinTimeout);
    spinStep();
  }

  function hideFloatingSlotPicker(delay = 0) {
    if (delay > 0) {
      setTimeout(() => showFloatingSlotPicker(false), delay);
    } else {
      showFloatingSlotPicker(false);
    }
  }

  // --- Slot Picker Modal Logic ---
  // Only one DOMContentLoaded, so just run this logic here
  const slotPickerModal = document.getElementById('slotPickerModal');
  const slotProviderFilters = document.getElementById('slotProviderFilters');
  window.slotPickerSpinner = document.getElementById('slotPickerSpinner');
  window.slotPickerResult = document.getElementById('slotPickerResult');
  const spinSlotBtn = document.getElementById('spinSlotBtn');
  const closeSlotPickerBtn = document.getElementById('closeSlotPickerBtn');

  function getProviders() {
    const providers = new Set();
    slotDatabase.forEach(slot => {
      if (slot.provider) providers.add(slot.provider.trim());
    });
    return Array.from(providers).sort();
  }

  function renderProviderFilters() {
    if (!slotProviderFilters) return;
    const providers = getProviders();
    slotProviderFilters.innerHTML = '';
    providers.forEach(provider => {
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '4px';
      label.innerHTML = `<input type="checkbox" value="${provider}" checked> <span>${provider}</span>`;
      slotProviderFilters.appendChild(label);
    });
  }

  function getFilteredSlots() {
    if (!slotProviderFilters) return [];
    const checked = Array.from(slotProviderFilters.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    return slotDatabase.filter(slot => checked.includes(slot.provider));
  }

  if (cartIcon && slotPickerModal && window.slotPickerSpinner) {
    cartIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      renderProviderFilters();
      window.slotPickerResult && (window.slotPickerResult.style.display = 'none');
      window.slotPickerSpinner.innerHTML = '<span style="color:#7ec6ff;font-size:1.2em;">Ready to spin!</span>';
      slotPickerModal.style.display = 'block';
    });
  }
  if (closeSlotPickerBtn && slotPickerModal) {
    closeSlotPickerBtn.addEventListener('click', function() {
      slotPickerModal.style.display = 'none';
      hideFloatingSlotPicker();
    });
  }
  window.addEventListener('click', function(e) {
    if (slotPickerModal && slotPickerModal.style.display === 'block' && !slotPickerModal.contains(e.target) && !(cartIcon && cartIcon.contains(e.target))) {
      slotPickerModal.style.display = 'none';
      hideFloatingSlotPicker();
    }
  });

  if (spinSlotBtn && slotProviderFilters && window.slotPickerSpinner) {
    spinSlotBtn.addEventListener('click', function() {
      const checkedProviders = Array.from(slotProviderFilters.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
      if (!checkedProviders.length) {
        window.slotPickerSpinner.innerHTML = '<span style="color:#ff3e3e;">No providers selected!</span>';
        return;
      }
      const provider = checkedProviders[Math.floor(Math.random() * checkedProviders.length)];
      const providerSlots = slotDatabase.filter(slot => slot.provider === provider);
      if (!providerSlots.length) {
        window.slotPickerSpinner.innerHTML = `<span style="color:#ff3e3e;">No slots for provider: ${provider}!</span>`;
        return;
      }
      window.slotPickerResult.style.display = 'none';
      spinSlotBtn.disabled = true;
      if (spinTimeout) clearTimeout(spinTimeout);
      unifiedSpinAnimation(providerSlots, function(picked) {
        window.slotPickerResult.style.display = 'none';
        spinSlotBtn.disabled = false;
      });
    });
    slotProviderFilters.addEventListener('change', function() {
      window.slotPickerResult && (window.slotPickerResult.style.display = 'none');
      window.slotPickerSpinner.innerHTML = '<span style="color:#7ec6ff;font-size:1.2em;">Ready to spin!</span>';
      if (spinTimeout) clearTimeout(spinTimeout);
    });
  }

  // --- Controls Pill & Expanded Card Logic ---
  const controlsPill = document.getElementById('controls-pill');
  const controlsCategories = document.getElementById('controls-categories');
  const controlsExpandedCard = document.getElementById('controls-expanded-card');
  const controlsExpandedContent = document.getElementById('controls-expanded-content');
  const controlsCloseBtn = document.getElementById('controls-close-btn');

  // Panels to move into expanded card
  const bonusHuntControls = document.getElementById('bonus-hunt-controls');
  const tournamentMatchControl = document.getElementById('tournamentMatchControl');
  const tournamentSetupPanel = document.getElementById('tournamentSetupPanel');
  // slotPickerModal already defined

  function hideAllControls() {
    [bonusHuntControls, tournamentMatchControl, tournamentSetupPanel, slotPickerModal].forEach(panel => {
      if (panel) {
        panel.style.display = 'none';
        if (panel.parentNode === controlsExpandedContent) {
          controlsExpandedContent.removeChild(panel);
        }
      }
    });
  }

  if (controlsPill) controlsPill.style.display = 'flex';

  if (controlsPill && controlsExpandedCard && controlsExpandedContent) {
    controlsPill.addEventListener('click', function() {
      const isOpen = controlsExpandedCard.classList.toggle('open');
      if (isOpen) {
        controlsExpandedCard.style.display = 'block';
        setTimeout(() => {
          controlsExpandedCard.classList.add('slide-in');
        }, 10);
        hideAllControls();
      } else {
        controlsExpandedCard.classList.remove('slide-in');
        controlsExpandedCard.classList.add('slide-out');
        setTimeout(() => {
          controlsExpandedCard.style.display = 'none';
          controlsExpandedCard.classList.remove('slide-out');
        }, 700);
      }
    });
  }

  if (controlsCloseBtn && controlsExpandedCard) {
    controlsCloseBtn.addEventListener('click', function() {
      controlsExpandedCard.classList.remove('slide-in');
      controlsExpandedCard.classList.add('slide-out');
      setTimeout(() => {
        controlsExpandedCard.style.display = 'none';
        controlsExpandedCard.classList.remove('slide-out');
      }, 700);
    });
  }

  if (controlsCategories && controlsExpandedContent) {
    controlsCategories.addEventListener('click', function(e) {
      const target = e.target.closest('.controls-category-btn');
      if (!target) return;
      const category = target.dataset.category;
      target.parentNode.querySelectorAll('.controls-category-btn').forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');
      hideAllControls();
      setTimeout(() => {
        if (category === 'bonusHunt' && bonusHuntControls) {
          controlsExpandedContent.appendChild(bonusHuntControls);
          bonusHuntControls.style.display = 'block';
          bonusHuntControls.classList.add('slide-in');
        } else if (category === 'tournament' && tournamentMatchControl) {
          controlsExpandedContent.appendChild(tournamentMatchControl);
          tournamentMatchControl.style.display = 'block';
          tournamentMatchControl.classList.add('slide-in');
        } else if (category === 'slotPicker' && slotPickerModal) {
          controlsExpandedContent.appendChild(slotPickerModal);
          slotPickerModal.style.display = 'block';
          slotPickerModal.classList.add('slide-in');
        }
      }, 10);
    });
  }

  // Initial setup: show bonus hunt controls by default
  hideAllControls && hideAllControls();
  if (controlsExpandedContent && bonusHuntControls) {
    controlsExpandedContent.appendChild(bonusHuntControls);
    bonusHuntControls.style.display = 'block';
    setTimeout(() => {
      bonusHuntControls.classList.add('slide-in');
    }, 10);
  }
});
