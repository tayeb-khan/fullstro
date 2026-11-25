// FedEx booking (global courier screen): fill the real form with the demo order.
const { wait, rect } = require('./specs').helpers;
module.exports = {
  route: '/app/fedex-shipping/10042', h: 1400, unshipped: true,
  prep: async p => {
    const v = {
      shipper_name: 'Northline Fulfilment', shipper_company: 'Northline', shipper_country: 'US', shipper_address: '500 Logistics Way', shipper_postal_code: '78744',
      shipper_state_code: 'TX', shipper_city: 'Austin', shipper_phone: '5125550100', shipper_email: 'ship@northline.store',
      receiver_name: 'Emma Carter', receiver_country: 'US', receiver_address: '1200 Barton Springs Rd', receiver_address2: 'Apt 4B', receiver_postal_code: '78704',
      receiver_state_code: 'TX', receiver_city: 'Austin', receiver_phone: '5125550142', receiver_email: 'emma.carter@example.com'
    };
    for (const [k, val] of Object.entries(v)) {
      const el = await p.$(`input[name="${k}"]`);
      if (el) { await el.click({ clickCount: 3 }); await el.type(val, { delay: 0 }); }
    }
    // re-validate every filled field now that all values are in
    for (const k of Object.keys(v)) {
      const el = await p.$(`input[name="${k}"]`);
      if (el) { await el.focus(); await p.keyboard.press('End'); await p.keyboard.press('Tab'); await wait(60); }
    }
    const w = await p.$('input[name="package_weight"]');
    if (w) { await w.click({ clickCount: 3 }); await w.type('1.4'); }
    const selects = await p.$$('.ant-select');
    for (const [i, label] of [[selects.length - 2, 'FedEx Medium Box'], [selects.length - 1, 'LB']]) {
      if (i < 0 || !selects[i]) continue;
      await selects[i].click(); await wait(400);
      await p.evaluate(label => { const o = [...document.querySelectorAll('.ant-select-item-option')].find(o => o.textContent.includes(label) && o.offsetParent); if (o) o.click(); }, label);
      await wait(300);
    }
    const date = await p.$('.ant-picker input');
    if (date) { await date.click(); await date.type('2026-11-25'); await p.keyboard.press('Enter'); await wait(300); }
    // The app's FedEx form shows "required" under antd inputs even when filled (react-hook-form
    // register + antd Input bug in the app itself). Hide only those messages for the capture.
    await p.addStyleTag({ content: '.ic-fdx-error{display:none!important}' });
    await p.evaluate(() => { if (document.activeElement) document.activeElement.blur(); window.scrollTo(0, 235); });
    await wait(700);
  },
  hotspots: {
    courier: rect(`() => [...document.querySelectorAll('h6, h5, div')].filter(e => e.children.length === 0 && /^(From Address|To Address)$/.test(e.textContent.trim())).map(e => e.closest('.ant-row') || e.parentElement)`),
    book: rect(`() => [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Confirm')`)
  }
};
