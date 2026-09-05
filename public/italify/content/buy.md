# Buy Italify

@lede Italify can be licensed in two ways. Either per master (unlimited duration), or for a time period (unlimited masters).

If you activate a master, you can use Italify on it forever. Add glyphs, change outlines, change metadata – Italify is yours on this master, forever.

A time pass gives you unlimited masters, for a limited duration. Recommended if you are familiar with setting up Italify and have many masters to process.

```buttons
[Try free for 48 hours](trial) primary
```

## Your organisation size {#size}

Are you freelancing for a foundry? Working on a custom font? Then your client’s organisation size is what counts.

Get in touch for custom licensing options.

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

| Pass | Solo | Team | Studio | Foundry |
|------|------|------|--------|---------|
| One week | – | – | – | 300 € |
| Two weeks | – | – | 300 € | 500 € |
| One month | 100 € | 200 € | 400 € | 600 € |

## Master credits {#credits}

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

Prices exclude VAT. Your licence code arrives by email within minutes of the payment.

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

#### How do I add more credits?

Just add a new licence code. This will add the new credits from the code. Your existing credits stay untouched.