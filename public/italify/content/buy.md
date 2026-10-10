# Buy Italify

@lede Pay per master and keep it forever, or get unlimited masters for a set time.

```buttons
[Try free for 1 week](trial) primary
```

## Organisation size {#size}

Are you freelancing for a foundry? Working on a custom font? Then your client’s organisation size is what counts.

<!-- The size picker is wired up in buy: the chosen size prices
     every option below and the order. Keep the names in sync with the
     table headings below, which is what the script matches on. -->
<div class="choice-grid size-picker" id="size-picker" role="radiogroup" aria-label="Organisation size">
	<button type="button" class="choice-card size-option" data-size="thin" role="radio" aria-checked="true">
		<span class="choice-name">Thin</span>
		<span class="choice-desc">1 employee</span>
	</button>
	<button type="button" class="choice-card size-option" data-size="light" role="radio" aria-checked="false">
		<span class="choice-name">Light</span>
		<span class="choice-desc">2–3 employees</span>
	</button>
	<button type="button" class="choice-card size-option" data-size="medium" role="radio" aria-checked="false">
		<span class="choice-name">Medium</span>
		<span class="choice-desc">4–7 employees</span>
	</button>
	<button type="button" class="choice-card size-option" data-size="bold" role="radio" aria-checked="false">
		<span class="choice-name">Bold</span>
		<span class="choice-desc">8+ employees</span>
	</button>
</div>

## Licence {#licence}

Not sure? Master credits suit an in-development project with no fixed timeline. If you are familiar with Italify and have many masters or a set timeline, time passes are ideal.

<!-- Picks which of the two sections below is on show: #credits or
     #time (data-kind is the section id). -->
<div class="choice-grid kind-picker" id="kind-picker" role="radiogroup" aria-label="Licence">
	<button type="button" class="choice-card kind-option" data-kind="credits" role="radio" aria-checked="true">
		<span class="choice-name">Master credits</span>
		<span class="choice-desc">Activate a master once, use Italify on it forever.</span>
	</button>
	<button type="button" class="choice-card kind-option" data-kind="time" role="radio" aria-checked="false">
		<span class="choice-name">Time pass</span>
		<span class="choice-desc">Unlimited masters for a week, a month or a year.</span>
	</button>
</div>

## How many masters? {#credits}

One credit activates one master, forever. Credits never expire.

<!-- The table is the price list: buy reads it, builds the credit
     slider from it and hides it. Scripts/TrialWorker/test.mjs checks
     every cell against the Worker. -->

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

## How long? {#time}

Unlimited masters while the pass runs. It starts when you start it in Italify.

<!-- The table is the price list: buy reads it, builds the pass
     cards from it and hides it. A dash: that size can’t buy that pass. -->

| Pass | Thin | Light | Medium | Bold |
|------|------|-------|--------|------|
| One week | – | – | – | 300 € |
| Two weeks | – | – | 300 € | 500 € |
| One month | 100 € | 200 € | 400 € | 600 € |
| One year | 600 € | 1 200 € | 2 400 € | 3 600 € |

<!-- Ticked, a month or year pass is a subscription at the pass's
     price (package `<size>-monthly` / `<size>-yearly` in the Worker).
     For the week passes buy greys the switch out and shows the
     second note instead. -->
<div class="renew-block" id="order-renew-row" hidden>
	<label class="demo-toggle renew-switch"><input type="checkbox" id="order-renew"><span>Renew automatically</span></label>
	<p class="renew-note" id="renew-note">Renews every <span id="renew-unit">month</span> until you cancel.</p>
	<p class="renew-note" id="renew-unavailable" hidden>Automatic renewal is not available for weekly passes. A month pass is cheaper.</p>
</div>

## Seats {#seats}

One seat is one person, on up to three Macs. Each extra seat is 80% off.

<!-- Seats: the first at full price, each further one at 20 % – the
     same rule the Worker prices from, server-side. -->
<div class="seat-stepper" id="seat-stepper">
	<button type="button" id="seats-down" aria-label="One seat fewer">−</button>
	<output id="seats-value" aria-live="polite">1 seat</output>
	<button type="button" id="seats-up" aria-label="One seat more">+</button>
</div>

## Your details {#order}

For the invoice. Your licence key is sent to the email you enter during payment.

<form class="order-form" id="order-form" novalidate>
	<div class="field">
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
	<div class="field">
		<label for="order-company">Company or foundry (optional)</label>
		<input id="order-company" type="text" autocomplete="organization">
	</div>
	<!-- Shown once an EU country is chosen. -->
	<div class="field" id="order-vat-row" hidden>
		<label for="order-vat">VAT ID (optional)</label>
		<input id="order-vat" type="text" placeholder="e.g. DE123456789">
	</div>
	<!-- A top-up: the key of an existing licence (or one of its long
	     codes). buy asks the Worker about it (/licence/lookup) – the
	     licence's seats then price the order – and the Worker adds the
	     purchase to that licence. -->
	<details class="topup" id="order-topup">
		<summary>Adding to an existing licence?</summary>
		<div class="field">
			<label for="order-licence">Licence key</label>
			<input id="order-licence" type="text" placeholder="ITFY-XXXX-XXXX" autocomplete="off" spellcheck="false" autocapitalize="characters">
		</div>
		<p class="order-licence-note" id="order-licence-note"><strong>Every Mac on that licence picks up the order by itself.</strong> Leave it empty for a new licence.</p>
	</details>
</form>

<!-- The order summary: buy moves it beside the steps, where it
     stays in view. Its button submits the form above. -->
<aside class="order-summary" id="order-summary" aria-label="Your order">
	<h3>Your order</h3>
	<dl class="summary-lines">
		<div><dt>Size</dt><dd id="sum-size"></dd></div>
		<div><dt>Licence</dt><dd id="sum-package"></dd></div>
		<div><dt>Seats</dt><dd id="sum-seats"></dd></div>
		<div id="sum-renew-row" hidden><dt>Renews</dt><dd id="sum-renew"></dd></div>
	</dl>
	<div class="summary-total"><span>Total</span><span id="order-total"></span></div>
	<p class="summary-vat">excl. VAT</p>
	<button type="submit" form="order-form" class="button-primary" id="order-submit">Pay by card</button>
	<p class="order-status" id="order-status">Choose your country to continue.</p>
	<p class="summary-fine">Your licence key arrives by email within minutes. By purchasing you accept the <a href="eula">licence terms</a>.</p>
</aside>

## Free credits {#free}

**Student, or working on a minority script?** Get in touch for free master credits for your whole project: sebastian.carewe<span class="email-protected"></span>

## FAQ {#faq}

#### Is a credit tied to a single file or project?

No. A credit activates one master, wherever it lives, across any number of projects. Credits never expire.

#### What counts as a master?

What Glyphs calls a master (Font Info → Masters) – not a file, which can hold several.

### What about intermediate/alternate layers?

In Glyphs, special layers are always attached to a master layer. If that master layer is activated, its special layers are activated too.

#### When is a credit spent?

Only when you activate a master. Entering a licence key just adds credits. A running time pass always comes first, so it never spends your credits.

#### Does a duplicated master stay activated?

No, if it happens *in the same file*. An activation belongs to its master, so a copy needs a credit of its own.

A duplicated *file* keeps the activation in place.

#### When does a time pass start?

When you start it in Italify – right away, or later with *Start Pass…* in the settings. An automatically renewing pass starts on the day you pay.

#### How does automatic renewal work?

Month and year passes can renew by card at the end of each period, at the price you signed up at. Italify checks in once a day and picks up each renewal by itself; it works offline for up to a month at a time.

#### How do I cancel automatic renewal?

In Glyphs, *Glyph → Italify → Settings and Licences…* → *Manage Renewal…*, or via the link in your licence email. You keep access until the end of the paid period.

#### What if a renewal payment fails?

It is retried over the following days, and Italify keeps working for a week past the paid period in the meantime.

#### What is a licence key?

A short code like `ITFY-XXXX-XXXX`. Enter it once on each Mac (*Glyph → Italify → Settings and Licences…*); credits, passes and renewals then arrive by themselves. If it ever gets out, reply to your licence email and I’ll replace it.

#### How do I add credits or another pass?

Order with your licence key under *Adding to an existing licence?*. Credits are added to what you have; a new pass waits until you start it, and if one is still running it follows on without losing a day.
