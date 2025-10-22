<?php
session_start();

require_once __DIR__ . '/password.php'; // Passwort aus externer Datei laden

// simple CSRF token
if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(16)); }
$csrf = $_SESSION['csrf'];

$bannerFile = __DIR__ . '/banner.txt';
$message = '';

if (isset($_POST['action']) && ($_POST['csrf'] ?? '') === $csrf) {
  // tiny auth
  $ok = hash_equals(ADMIN_PASS, $_POST['password'] ?? '');
  // basic bot friction: reject if honeypot filled
  $bot = !empty($_POST['website']);
  if ($ok && !$bot) {
    $raw = trim($_POST['banner_text'] ?? '');
    // keep text only; allow simple line breaks
    $clean = preg_replace('/[^\P{C}\n\r\t]/u', '', $raw); // drop control chars
    file_put_contents($bannerFile, $clean, LOCK_EX);
    $message = 'Gespeichert.';
  } else {
    $message = 'Nicht autorisiert.';
  }
}

$current = is_readable($bannerFile) ? htmlspecialchars(trim(file_get_contents($bannerFile)), ENT_QUOTES, 'UTF-8') : '';
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,nofollow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Banner verwalten</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;margin:2rem;max-width:720px}
    h1{font-size:1.25rem}
    form{display:grid;gap:.75rem}
    textarea{width:100%;min-height:8rem;padding:.5rem}
    input[type=password],button{padding:.5rem}
    .msg{margin:.5rem 0;color:#064}
    .hint{color:#555;font-size:.9rem}
    .row{display:flex;gap:.5rem;align-items:center}
    .hp{position:absolute;left:-5000px;top:auto;width:1px;height:1px;overflow:hidden}
  </style>
</head>
<body>
  <h1>Bannertext</h1>
  <?php if ($message): ?><div class="msg"><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>

  <form method="post" action="admin.php">
    <label for="banner_text">Text für Banner (leer lassen = Banner ausblenden)</label>
    <textarea id="banner_text" name="banner_text" placeholder="z.B. Heute 18:00 Entscheidung wegen Wetter. Update ab 12:00."><?= $current ?></textarea>

    <div class="row">
      <label for="password">Passwort</label>
      <input id="password" type="password" name="password" required>
      <button type="submit" name="action" value="save">Speichern</button>
    </div>

    <!-- honeypot -->
    <label class="hp">Website <input type="text" name="website" autocomplete="off"></label>
    <input type="hidden" name="csrf" value="<?= $csrf ?>">
    <p class="hint">Tipp: Nur Text. Zeilenumbruch wird übernommen.</p>
  </form>

  <p><a href="index.php">Zurück zur Seite</a></p>
</body>
</html>
