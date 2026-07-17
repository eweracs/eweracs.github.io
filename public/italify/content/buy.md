# Buy Italify

@lede Italify can be licensed in two ways. Either per master (unlimited duration), or for a time period (unlimited masters). One credit activates one master, forever. You can decide what option makes more sense for your project.

@overline Per project

## Time passes {#time}

For a sprint across a whole family, a time pass gives you **unlimited masters** – every master in every file, no activation, no counting – for the duration of the pass.

| Pass | Price |
|------|-------|
| One week | 600 € |
| Two weeks | 1 000 € |

Credits and passes combine freely: masters you activate with credits stay activated after a pass ends.

@overline Per master

## Master credits {#credits}

One credit activates one master, **permanently**: run the filter on that master as often as you like, keep editing and re-italifying it forever, including at export. Credits never expire, and top-ups are delivered as a licence code by email.

| Package | Credits | Price | Rate/credit | Savings vs. single |
|---------|---------|-------|-------------|--------------------|
| Solo | 1 | 300 € | 300 € | — |
| Trio | 3 | 650 € | 217 € | 28% |
| Handful | 5 | 900 € | 180 € | 40% |
| Studio | 10 | 1 350 € | 135 € | 55% |
| Large | 16 | 1 700 € | 106 € | 65% |
| Foundry | 24 | 2 000 € | 83 € | 72% |

@overline Order

## Place your order {#order}

Pick your package and fill in your billing details. You’ll receive the invoice by email and your licence code follows as soon as the payment arrives.

<form class="order-form" id="order-form">
	<div class="span-2">
		<label for="order-package">Package</label>
		<select id="order-package" required>
			<option value="solo">Solo – 1 master credit – 300 €</option>
			<option value="trio">Trio – 3 master credits – 650 €</option>
			<option value="handful">Handful – 5 master credits – 900 €</option>
			<option value="studio">Studio – 10 master credits – 1 350 €</option>
			<option value="large">Large – 16 master credits – 1 700 €</option>
			<option value="foundry">Foundry – 24 master credits – 2 000 €</option>
			<option value="week">Time pass – one week – 600 €</option>
			<option value="twoweeks">Time pass – two weeks – 1 000 €</option>
		</select>
	</div>
	<div>
		<label for="order-name">Name</label>
		<input id="order-name" type="text" required autocomplete="name">
	</div>
	<div>
		<label for="order-company">Company / foundry (optional)</label>
		<input id="order-company" type="text" autocomplete="organization">
	</div>
	<div class="span-2">
		<label for="order-email">Email (invoice and licence code are sent here)</label>
		<input id="order-email" type="email" required autocomplete="email">
	</div>
	<div class="span-2">
		<label for="order-address">Billing address</label>
		<textarea id="order-address" required autocomplete="street-address" placeholder="Street, postal code, city"></textarea>
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
	<div class="span-2">
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

@overline How it works

## After your order {#how}

1. You receive your invoice by email, usually within a day.
2. Once the payment arrives, your licence code follows – along with the [plugin download](https://github.com/eweracs/Italify/releases/latest/download/Italify.glyphsPlugin.zip) if you don't have it yet (the download itself is free, and updates are too: replacing the plugin keeps your licence and activated masters in place).
3. Paste the code into the Italify filter dialogue in Glyphs – done. Later top-ups are just another code.

Not sure yet? The free trial gives you full access to everything for 48 hours.

```buttons
[Try free for 48 hours](trial) primary
[Read the handbook](handbook)
```
