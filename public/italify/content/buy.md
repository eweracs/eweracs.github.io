# Buy Italify

@lede Italify can be licensed in two ways. Either per master (unlimited duration), or for a time period (unlimited masters).

If you activate a master, you can use Italify on it forever. Add glyphs, change outlines, change metadata – Italify is yours on this master, forever.

A time pass gives you unlimited masters, for a limited duration. Recommended if you are familiar with setting up Italify and have many masters to process.

It’s up to you to decide what option makes more sense for your project.

Try the fully functional plugin for 48h, zero restrictions.
```buttons
[Try free for 48 hours](trial) primary
```

## Your organisation size {#size}

Italify is licensed based on organisation size. Get in touch for custom licensing options.

<!-- The size picker is wired up in buy: choosing a size filters both
     pricing tables below and the package list in the order form, and the
     switch turns the full grid back on. Keep the names in sync with the
     table headings below, which is what the script matches on. -->
<div class="size-picker" id="size-picker" role="radiogroup" aria-label="Organisation size">
	<button type="button" class="size-option" data-size="solo" role="radio" aria-checked="true">
		<span class="size-name">Solo</span>
		<span class="size-desc">1 person.</span>
	</button>
	<button type="button" class="size-option" data-size="team" role="radio" aria-checked="false">
		<span class="size-name">Team</span>
		<span class="size-desc">2–3 people.</span>
	</button>
	<button type="button" class="size-option" data-size="studio" role="radio" aria-checked="false">
		<span class="size-name">Studio</span>
		<span class="size-desc">4–7 people.</span>
	</button>
	<button type="button" class="size-option" data-size="foundry" role="radio" aria-checked="false">
		<span class="size-name">Foundry</span>
		<span class="size-desc">8+ people.</span>
	</button>
	<p class="size-compare-row">
		<button type="button" class="size-compare" id="size-compare" role="switch" aria-checked="false">
			<span class="switch" aria-hidden="true"><span class="switch-knob"></span></span>
			<span>Compare all sizes</span>
		</button>
	</p>
</div>

## Time passes {#time}

For a sprint across a whole family, a time pass gives you **unlimited masters** – every master in every file, no activation, no counting – for the duration of the pass.

| Pass | Solo | Team | Studio | Foundry |
|------|------|------|--------|---------|
| One week | – | – | – | 300 € |
| Two weeks | – | – | 300 € | 500 € |
| One month | 100 € | 200 € | 400 € | 600 € |

A pass starts when you enter the code in Glyphs.

Credits and passes combine freely: masters you activate with credits stay activated after a pass ends.

## Master credits {#credits}

One credit activates one master, **forever**: run the filter on that master as often as you like, keep editing, add glyphs, use Italify on it forever, including at export. Credits never expire, and you can easily top up with a new licence code.

| Credits | Solo | Team | Studio | Foundry |
|---------|------|------|--------|---------|
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

Pick your package and fill in your billing details. You’ll receive the invoice by email and your licence code follows as soon as the payment arrives.

Prices exclude VAT. German and EU customers are invoiced plus 19% German VAT; EU businesses that give a VAT ID are invoiced without it under the reverse-charge rule, and customers outside the EU pay no EU VAT. The total below says which applies to you as soon as you pick your country.

<form class="order-form" id="order-form">
	<div>
		<label for="order-size">Size</label>
		<select id="order-size" required>
			<option value="solo">Solo</option>
			<option value="team">Team</option>
			<option value="studio">Studio</option>
			<option value="foundry">Foundry</option>
		</select>
	</div>
	<div>
		<!-- Filled in by buy from the pricing tables above, for the
		     size selected on the left. -->
		<label for="order-package">Package</label>
		<select id="order-package" required></select>
	</div>
	<div>
		<label for="order-first-name">First name</label>
		<input id="order-first-name" type="text" required autocomplete="given-name">
	</div>
	<div>
		<label for="order-last-name">Surname</label>
		<input id="order-last-name" type="text" required autocomplete="family-name">
	</div>
	<div class="span-2">
		<label for="order-company">Company / foundry (optional)</label>
		<input id="order-company" type="text" autocomplete="organization">
	</div>
	<div class="span-2">
		<label for="order-email">Email (invoice and licence code are sent here)</label>
		<input id="order-email" type="email" required autocomplete="email">
	</div>
	<!-- The address is asked for a part at a time so autofill can fill it
	     and nothing is left out; the Worker composes the parts into the
	     line-broken block the invoice prints. Which of them are required
	     depends on the country – buy keeps that in step, and the
	     Worker's countries.mjs is what actually gates the order. -->
	<div class="span-2">
		<label for="order-street">Street and number</label>
		<input id="order-street" type="text" required autocomplete="address-line1">
	</div>
	<div class="span-2">
		<label for="order-address-2">Address line 2 (optional)</label>
		<input id="order-address-2" type="text" autocomplete="address-line2">
	</div>
	<div>
		<label for="order-postcode">Postcode</label>
		<input id="order-postcode" type="text" required autocomplete="postal-code">
	</div>
	<div>
		<label for="order-city">Town / city</label>
		<input id="order-city" type="text" required autocomplete="address-level2">
	</div>
	<div>
		<label for="order-state">State / province</label>
		<input id="order-state" type="text" autocomplete="address-level1">
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
	<div>
		<label for="order-note">Note (optional)</label>
		<input id="order-note" type="text">
	</div>
	<div class="hp" aria-hidden="true">
		<label for="order-website">Website</label>
		<input id="order-website" type="text" tabindex="-1" autocomplete="off">
	</div>
	<div class="span-2 order-actions">
		<button type="submit" class="button-primary" id="order-submit">Order now</button>
		<span class="order-total" id="order-total"></span>
	</div>
	<p class="order-status span-2" id="order-status" hidden></p>
</form>

Prefer email? Custom order? Get in touch directly: sebastian.carewe<span class="email-protected"></span>

## After your order {#how}

1. You receive your invoice by email, usually within a day.
2. Once the payment arrives, your licence code follows.
3. Paste the code into the Italify filter dialogue in Glyphs – done. Your purchase is activated. You can top up credits later simply by entering a new code.

Not sure yet? The free trial gives you full access to everything for 48 hours.

```buttons
[Try free for 48 hours](trial) primary
[Read the handbook](handbook/)
```
