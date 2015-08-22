<?php

/**
 * @author James Thomason, Jr <james@jamesthomasonjr.com>
 * @copyright 2015 James Thomason, Jr
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 * @version 0.0.1
 */
namespace JamesThomasonJr;

class Application
{
    public function main() : Application
    {
        printf("%s\n", "Hello, world!");

        return $this;
    }
}
