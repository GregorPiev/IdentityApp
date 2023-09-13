﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayController : Controller
    {
        [HttpGet("get-players")]
        public IActionResult Players()
        {
            return Ok(new JsonResult(new { message = "Only authorized users can view players" }));
        }
    }
}
