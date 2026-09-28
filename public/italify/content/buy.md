# Buy Italify

@lede Italify can be licensed in two ways. Either per master (unlimited duration), or for a time period (unlimited masters).

```buttons
[Try free for 48 hours](trial) primary
```

## Your organisation size {#size}

Are you freelancing for a foundry? Working on a custom font? Then your client’s organisation size is what counts.

One licence, one seat. One seat includes three devices. Get in touch for custom licensing options.

<!-- The size picker is wired up in buy: choosing a size filters both
     pricing tables below and the package list in the order form, and the
     switch turns the full grid back on. Keep the names in sync with the
     table headings below, which is what the script matches on. -->
<div class="size-picker" id="size-picker" role="radiogroup" aria-label="Organisation size">
	<button type="button" class="size-option" data-size="thin" role="radio" aria-checked="true">
		<span class="size-name">Thin</span>
		<span class="size-desc">1 employee.</span>
	</button>
	<button type="button" class="size-option" data-size="light" role="radio" aria-checked="false">
		<span class="size-name">Light</span>
		<span class="size-desc">2–3 employees.</span>
	</button>
	<button type="button" class="size-option" data-size="medium" role="radio" aria-checked="false">
		<span class="size-name">Medium</span>
		<span class="size-desc">4–7 employees.</span>
	</button>
	<button type="button" class="size-option" data-size="bold" role="radio" aria-checked="false">
		<span class="size-name">Bold</span>
		<span class="size-desc">8+ employees.</span>
	</button>
	<p class="size-compare-row">
		<button type="button" class="size-compare" id="size-compare" role="switch" aria-checked="false">
			<span class="switch" aria-hidden="true"><span class="switch-knob"></span></span>
			<span>Compare all sizes</span>
		</button>
	</p>
</div>

## Time passes {#time}

A time pass gives you unlimited masters, for a limited duration. Recommended if you are familiar with setting up Italify and have many masters to process. A one-year pass costs the same as six months.

**Automatic renewal.** Month and year passes can renew automatically: tick *Renew automatically* when you order. The pass then runs from the day you pay and renews at the end of each month or year until you cancel. You enter your licence code once – every renewal reaches Italify by itself. Without automatic renewal, a pass starts when you enter your code, and simply ends.

Prices shown for one seat. Each additional seat is 80% off.

| Pass | Thin | Light | Medium | Bold |
|------|------|-------|--------|------|
| One week | – | – | – | 300 € |
| Two weeks | – | – | 300 € | 500 € |
| One month | 100 € | 200 € | 400 € | 600 € |
| One year | 600 € | 1 200 € | 2 400 € | 3 600 € |

## Master credits {#credits}

If you activate a master, you can use Italify on it forever. Add glyphs, change outlines, change metadata – Italify is yours on this master, forever.

Prices shown for one seat. Each additional seat is 80% off.

| Credits | Thin | Light | Medium | Bold |
|---------|------|-------|--------|------|
| 1 | 50 € | 70 € | 100 € | 150 € |
| 2 | 80 € | 120 € | 170 € | 250 € |
| 3 | 110 € | 160 € | 220 € | 350 € |
| 4 | 140 € | 190 € | 270 € | 400 € |
| 6 | 180 € | 250 € | 350 € | 500 € |
| 8 | 220 € | 300 € | 420 € | 600 € |
| 10 | 250 € | 340 € | 480 € | 700 € |
| 16 | 330 € | 440 € | 620 € | 850 € |
| 24 | 400 € | 540 € | 740 € | 1 000 € |

## Place your order {#order}

Prices exclude VAT. Your licence code arrives by email within minutes of the payment. By purchasing you accept the [licence terms](eula).

<form class="order-form" id="order-form">
	<div>
		<label for="order-size">Size</label>
		<select id="order-size" required>
			<option value="thin">Thin</option>
			<option value="light">Light</option>
			<option value="medium">Medium</option>
			<option value="bold">Bold</option>
		</select>
	</div>
	<div>
		<!-- Seats: the first at full price, each further one at 20 % –
		     the same rule the Worker prices from, server-side. -->
		<label for="order-seats">Seats</label>
		<select id="order-seats">
			<option value="1">1 seat</option>
			<option value="2">2 seats</option>
			<option value="3">3 seats</option>
			<option value="4">4 seats</option>
			<option value="5">5 seats</option>
			<option value="6">6 seats</option>
			<option value="7">7 seats</option>
			<option value="8">8 seats</option>
			<option value="9">9 seats</option>
			<option value="10">10 seats</option>
		</select>
	</div>
	<div>
		<!-- Filled in by buy from the pricing tables above, for the
		     size and seats selected on the left – each package priced at
		     that seat count. -->
		<label for="order-package">Package</label>
		<select id="order-package" required></select>
		<!-- Month and year passes only – buy shows it for those. Ticked,
		     the pass is a subscription at the pass's price (package
		     `<size>-monthly` / `<size>-yearly` in the Worker). -->
		<label class="demo-toggle renew-toggle" id="order-renew-row" hidden>
			<input type="checkbox" id="order-renew">
			<span>Renew automatically</span>
		</label>
	</div>
	<div>
		<label for="order-company">Company / foundry (optional)</label>
		<input id="order-company" type="text" autocomplete="organization">
	</div>
	<div>
		<label for="order-country">Country</label>
			<select id="order-country" required>
				<option value="" disabled selected>Select your country…</option>
				<optgroup label="European Union">
					<option value="AT">Austria</option>
					<option value="BE">Belgium</option>
					<option value="BG">Bulgaria</option>
					<option value="HR">Croatia</option>
					<option value="CY">Cyprus</option>
					<option value="CZ">Czech Republic</option>
					<option value="DK">Denmark</option>
					<option value="EE">Estonia</option>
					<option value="FI">Finland</option>
					<option value="FR">France</option>
					<option value="DE">Germany</option>
					<option value="GR">Greece</option>
					<option value="HU">Hungary</option>
					<option value="IE">Ireland</option>
					<option value="IT">Italy</option>
					<option value="LV">Latvia</option>
					<option value="LT">Lithuania</option>
					<option value="LU">Luxembourg</option>
					<option value="MT">Malta</option>
					<option value="NL">Netherlands</option>
					<option value="PL">Poland</option>
					<option value="PT">Portugal</option>
					<option value="RO">Romania</option>
					<option value="SK">Slovakia</option>
					<option value="SI">Slovenia</option>
					<option value="ES">Spain</option>
					<option value="SE">Sweden</option>
				</optgroup>
				<optgroup label="Rest of the world">
					<option value="AR">Argentina</option>
					<option value="AU">Australia</option>
					<option value="BR">Brazil</option>
					<option value="CA">Canada</option>
					<option value="CN">China</option>
					<option value="HK">Hong Kong</option>
					<option value="IS">Iceland</option>
					<option value="IN">India</option>
					<option value="IL">Israel</option>
					<option value="JP">Japan</option>
					<option value="LI">Liechtenstein</option>
					<option value="MX">Mexico</option>
					<option value="NZ">New Zealand</option>
					<option value="NO">Norway</option>
					<option value="RS">Serbia</option>
					<option value="SG">Singapore</option>
					<option value="ZA">South Africa</option>
					<option value="KR">South Korea</option>
					<option value="CH">Switzerland</option>
					<option value="TW">Taiwan</option>
					<option value="TR">Turkey</option>
					<option value="UA">Ukraine</option>
					<option value="AE">United Arab Emirates</option>
					<option value="GB">United Kingdom</option>
					<option value="US">United States</option>
					<option value="XX">Other (not listed)</option>
				</optgroup>
			</select>
	</div>
	<div>
		<label for="order-vat">VAT ID (EU businesses, optional)</label>
		<input id="order-vat" type="text" placeholder="e.g. DE123456789">
	</div>
	<div class="span-2 order-actions">
		<button type="submit" class="button-primary" id="order-submit">Pay by card</button>
		<span class="order-total" id="order-total"></span>
	</div>
	<p class="order-status span-2" id="order-status" hidden></p>
</form>

## Free credits
Are you a student, or working on a minority script? Get in touch directly for free masters credits covering your complete project.

## FAQ {#faq}

#### Is a credit tied to a single file or project?

No. A credit activates one master, wherever it lives. You can spread them across many projects over many years. Credits never expire.

#### What is a master, exactly?

A master is what Glyphs defines as such (Font Info → Masters). It is not the same as a Glyphs file, which can contain multiple masters.

#### What about intermediate/alternate layers?

In Glyphs, special layers are always attached to a master layer. If that master layer is activated, its special layers are activated too.

#### When is a master credit spent?

Only when you explicitly say so. Entering a licence code adds credits and nothing else. If you run the filter on a master that isn’t activated yet, Italify is locked. If you activate that master, the credit is spent and the master is activated forever.

#### What if I have existing master credits, but add a time pass?

If you add a **time pass** code, it is activated immediately. A time pass is always preferred over master credits, so there is no danger of accidentally spending existing master credits when you have an active time pass.

#### Does a duplicated master stay activated?

No. An activation belongs to the master it was granted to, so a copy needs a credit of its own.

#### What if my font has more masters than I have credits?

Italify runs on the masters you have activated. The others stay locked until you activate them too. If you need a custom amount the packs don’t cover, just get in touch and we’ll work something out.

#### How does automatic renewal work?

An automatically renewing pass is a subscription: at the end of each month or year it renews by card, at the price you signed up at. You enter your licence code once – Italify checks in with the licence server once a day and picks up every renewal by itself.

#### Can I use an automatically renewing pass offline?

Yes, for up to a month at a time. Italify needs to reach the licence server at least once a month to confirm the renewal. If your Mac has been offline for longer, Italify pauses until it can check in again. A pass without automatic renewal needs no such check.

#### How do I cancel automatic renewal?

In Glyphs, choose *Glyph → Italify → Settings and Licences…*, then *Manage Renewal…*, or use the link in your licence email. You keep full access until the end of the period you have paid for.

#### What if a renewal payment fails?

The payment is retried over the following days, and Italify keeps working for a week past the paid period in the meantime. As soon as the payment goes through, Italify picks it up by itself.

#### How do I add more credits?

Just add a new licence code. This will add the new credits from the code. Your existing credits stay untouched.