<?php
/**
 * 이 파일은 모임즈툴즈의 일부입니다. (https://www.moimz.tools)
 *
 * 모임즈툴즈 인스톨러
 *
 * @file /installer/index.php
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @modified 2023. 1. 26.
 */
$name = isset($_GET['name']) == true ? $_GET['name'] : null;
$version = isset($_GET['version']) == true ? $_GET['version'] : null;
$languages = json_decode(file_get_contents('./languages.json'));
?>
<header>
    <h1>
        <?php echo $name; ?> Installer
        <small>From moimz.tools</small>
    </h1>

    <div data-role="select" data-name="language">
        <input type="hidden" name="language">
        <button type="button">
            <span>Select Language</span>
            <i></i>
        </button>
        
        <ul>
            <?php foreach ($languages as $code => $text) { ?>
            <li data-value="<?php echo $code; ?>"><?php echo $text; ?></li>
            <?php } ?>
        </ul>
    </div>
</header>

<main>
    <div id="observer"></div>
    <section>
        <article>
            <h2 style="background-image: url(//www.moimz.tools/images/<?php echo $name; ?>.png);">
                <?php echo $name; ?> <small>v<?php echo $version; ?></small>
            </h2>
            
            <div data-step="license">
                <p><?php echo nl2br(file_get_contents('./licenses/MIT')); ?></p>
                
                <label><input type="checkbox" name="license" data-required="true"> <span>${step.license.agree}</span></label>
            </div>
            
            <div data-step="requirements">
                <button type="button" data-action="requirements_refresh">
                    <i class="mi mi-refresh-bold"></i>
                    <span>${step.requirements.refresh}</span>
                </button>
                
                <input type="hidden" name="requirements_success">
                <input type="hidden" name="requirements_checked">
                <ul></ul>
            </div>
            
            <div data-step="configs">
                <div data-role="loading">
                    <div><i class="mi mi-loading"></i><p>${step.configs.loading}</p></div>
                </div>
                
                <div data-role="code">
                    <div></div>
                </div>
                
                <input type="hidden" name="token">
                
                <div data-role="input">
                    <label>${step.configs.key.label}</label>
                    <input type="text" name="key" autocomplete="off">
                    <div data-role="help" data-name="key">${step.configs.key.help.init}</div>
                </div>
                
                <hr>
                
                <div data-role="input">
                    <label>${step.configs.path.label}</label>
                    <input type="text" name="path">
                    <div data-role="help" data-name="path">${step.configs.path.help.init}</div>
                </div>
                
                <div data-role="input">
                    <label>${step.configs.dir.label}</label>
                    <input type="text" name="dir">
                    <div data-role="help" data-name="dir">${step.configs.dir.help.init}</div>
                </div>
                
                <div data-role="input">
                    <label>${step.configs.attachment.label}</label>
                    <input type="text" name="attachment">
                    <div data-role="help" data-name="attachment">${step.configs.attachment.help.init}</div>
                </div>
                
                <div data-role="input">
                    <label>${step.configs.cache.label}</label>
                    <input type="text" name="cache">
                    <div data-role="help" data-name="cache">${step.configs.cache.help.init}</div>
                </div>
                
                <hr>
                
                <div data-role="input">
                    <label>${step.configs.db.host.label}</label>
                    <input type="text" name="db_host" value="localhost">
                </div>
                
                <div data-role="input">
                    <label>${step.configs.db.port.label}</label>
                    <input type="text" name="db_port" value="3306">
                </div>
                
                <div data-role="input">
                    <label>${step.configs.db.id.label}</label>
                    <input type="text" name="db_id">
                </div>
                
                <div data-role="input">
                    <label>${step.configs.db.password.label}</label>
                    <input type="text" name="db_password">
                </div>
                
                <div data-role="input">
                    <label>${step.configs.db.database.label}</label>
                    <input type="text" name="db_database">
                    <div data-role="help" data-name="db"></div>
                    <div data-role="help" data-name="db_version"></div>
                </div>
                
                <hr>
                
                <div data-role="input">
                    <label>${step.configs.prefix.label}</label>
                    <input type="text" name="prefix">
                    <div data-role="help" data-name="prefix">${step.configs.prefix.help.init}</div>
                </div>
                
                <hr>
                
                <div data-role="input">
                    <label>${step.configs.admin_email.label}</label>
                    <input type="text" name="admin_email" autocomplete="off">
                    <div data-role="help" data-name="admin_email">${step.configs.admin_email.help.init}</div>
                </div>
                
                <div data-role="input">
                    <label>${step.configs.admin_password.label}</label>
                    <input type="text" name="admin_password" autocomplete="off">
                    <div data-role="help" data-name="admin_password">${step.configs.admin_password.help.init}</div>
                </div>
                
                <div data-role="input">
                    <label>${step.configs.admin_name.label}</label>
                    <input type="text" name="admin_name">
                </div>
            </div>
            
            <div data-step="install">
                <input type="hidden" name="installed" data-required="true">
                <ul data-role="core">
                    <li data-type="configs">
                        <i class="mi mi-loading"></i><span>${step.install.configs.init}</span>
                    </li>
                    <li data-type="databases">
                        <i class="mi mi-loading"></i><span>${step.install.databases.init}</span>
                    </li>
                </ul>
                <ul data-role="dependencies"></ul>
            </div>
            
            <div data-step="complete">
                다했다!
            </div>
            
            <nav>
                <ul data-role="steps">
                    <li data-step="license"></li>
                    <li data-step="requirements"></li>
                    <li data-step="configs"></li>
                    <li data-step="install"></li>
                    <li data-step="complete"></li>
                </ul>
                
                <button type="button" disabled="disabled">
                    <i class="mi mi-back-bold"></i>
                    <span>${button.prev}</span>
                </button>
                <button type="submit" disabled="disabled">
                    <span>${button.next}</span>
                    <i class="mi mi-go-bold"></i>
                </button>
            </nav>
        </article>
    </section>
</main>
