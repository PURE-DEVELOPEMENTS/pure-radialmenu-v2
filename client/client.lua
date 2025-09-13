local RSGCore = exports['rsg-core']:GetCoreObject()
local PlayerData = {}
local PlayerJob = nil

-- Preload filter on resource start to make it instant when needed
Citizen.CreateThread(function()
    Citizen.InvokeNative(0x5199405EABFBD7F0, "WheelHUDIn")
end)

-- Simplified filter functions for more instant response
local function startFilter()
    Citizen.InvokeNative(0x4102732DF6B4005F, "WheelHUDIn")
end

local function stopFilter()
    Citizen.InvokeNative(0xB4FD7446BAB2F394, "WheelHUDIn")
end

-- Initialize player data when loaded
RegisterNetEvent('RSGCore:Client:OnPlayerLoaded')
AddEventHandler('RSGCore:Client:OnPlayerLoaded', function()
    PlayerData = RSGCore.Functions.GetPlayerData()
    PlayerJob = PlayerData.job.name
    print('[DEBUG] Player Loaded - Job:', PlayerJob)
end)

-- Update player job when it changes
RegisterNetEvent('RSGCore:Client:OnJobUpdate')
AddEventHandler('RSGCore:Client:OnJobUpdate', function(JobInfo)
    PlayerJob = JobInfo.name
    print('[DEBUG] Job Updated - New Job:', PlayerJob)
end)

-- Helper function to parse action string
local function parseAction(actionStr)
    if not actionStr then return nil end
    
    local parts = {}
    for part in actionStr:gmatch("[^:]+") do
        table.insert(parts, part)
    end
    
    if #parts == 3 then
        return {
            namespace = parts[1],
            type = parts[2],
            action = parts[3]
        }
    elseif #parts == 2 then
        return {
            type = parts[1],
            action = parts[2]
        }
    else
        return {
            action = actionStr
        }
    end
end

-- Menu state variables
local isMenuVisible = false
local showMenu = true
local keyPressed = false

-- Main thread for menu control
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        
        if IsControlJustPressed(0, 0x3C0A40F2) and not keyPressed then -- F6 key
            keyPressed = true
            isMenuVisible = true
            
            -- Start filter and open menu simultaneously
            startFilter()
            SendNUIMessage({
                type = "openMenu",
                startMonitoring = true,
                playerJob = PlayerJob
            })
            SetNuiFocus(true, true)
        end
    end
end)

RegisterNetEvent('pure-radialmenu:client:Menu')
AddEventHandler('pure-radialmenu:client:Menu', function()
    MenuShow()
end)

-- police emergency button pressed
RegisterNetEvent('pure-radialmenu:client:SendLawmanEmergencyAlert', function()
    local Player = RSGCore.Functions.GetPlayerData()
    local firstname = Player.charinfo.firstname
    local lastname = Player.charinfo.lastname
    -- notify police
    TriggerServerEvent('police:server:policeAlert', 'Шериф '..firstname..' '..lastname..' изпрати спешна сова!')
    -- notify medics
    TriggerServerEvent('rsg-medic:server:medicAlert', 'Шериф '..firstname..' '..lastname..' изпрати спешна сова!')
end)

RegisterNUICallback('keyReleased', function(data, cb)
    isMenuVisible = false
    keyPressed = false
    
    -- Remove filter and close menu simultaneously
    stopFilter()
    SendNUIMessage({
        type = "closeMenu"
    })
    SetNuiFocus(false, false)
    
    Citizen.Wait(100)
    keyPressed = false
    
    cb('ok')
end)

RegisterNUICallback('menuSelect', function(data, cb)
    if data.action then
        local actionData = parseAction(data.action)
        print('[DEBUG] Menu Selection - Action:', data.action)
        
        if actionData then
            if actionData.type == 'client' then
                TriggerEvent(data.action)
            elseif actionData.type == 'server' then
                TriggerServerEvent(data.action)
            elseif actionData.type == 'command' then
                ExecuteCommand(actionData.action)
            else
                -- Handle specific actions
                if data.action == "callWagon" then
                    TriggerEvent('rsg-horses:client:callwagon')
                elseif data.action == "fleeWagon" then
                    TriggerEvent('rsg-horses:client:fleewagon')
                elseif data.action == "fixWagon" then
                    TriggerEvent('rsg-horses:client:fixwagon')
                elseif data.action == "sidesaddle" then
                    TriggerEvent('rsg-horses:client:sidesaddle')
                elseif data.action == "fleeHorse" then
                    TriggerEvent('rsg-horses:client:fleehorse')
                elseif data.action == "reloadHorse" then
                    TriggerEvent('rsg-horses:client:reloadhorse')
                elseif data.action == "inspect" then
                    TriggerEvent('rsg-weapons:client:inspectweapon')
                elseif data.action == "loadskin" then
                    TriggerEvent('rsg-appearance:LoadSkin')
                elseif data.action == "sellcontraband" then
                    TriggerServerEvent('rsg-contraband:server:sellcontraband')
                elseif data.action == "submenu1" then
                    TriggerEvent('emotes:OpenEmotesSubmenu1')
                elseif data.action == "submenu2" then
                    TriggerEvent('emotes:OpenEmotesSubmenu2')
                elseif data.action == "submenu3" then
                    TriggerEvent('emotes:OpenEmotesSubmenu3')
                elseif data.action == "submenu4" then
                    TriggerEvent('emotes:OpenEmotesSubmenu4')
                elseif data.action == "submenu5" then
                    TriggerEvent('emotes:OpenEmotesSubmenu5')
                elseif data.action == "submenu6" then
                    TriggerEvent('emotes:OpenEmotesSubmenu6')
                elseif data.action == "submenu7" then
                    TriggerEvent('emotes:OpenEmotesSubmenu7')
                elseif data.action == "cancelemote" then
                    TriggerEvent('emotes:CancelEmote')
                -- Handle job-specific actions with job check
                elseif string.find(data.action, "rsg-police:") then
                    if PlayerJob == "police" then
                        TriggerEvent(data.action)
                    end
                elseif string.find(data.action, "rsg-medic:") then
                    if PlayerJob == "medic" then
                        TriggerEvent(data.action)
                    end
                elseif string.find(data.action, ":") then
                    TriggerEvent(data.action)
                else
                    print("[DEBUG] Unhandled action:", data.action)
                end
            end
        end
    end
    cb('ok')
end)

AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    
    if isMenuVisible then
        isMenuVisible = false
        keyPressed = false
        SetNuiFocus(false, false)
        stopFilter()
        SendNUIMessage({
            type = "closeMenu"
        })
    end
end)

function MenuShow()
    if showMenu then
        isMenuVisible = true
        keyPressed = true
        
        -- Start filter and open menu simultaneously
        startFilter()
        SendNUIMessage({
            type = "openMenu",
            startMonitoring = true,
            playerJob = PlayerJob
        })
        SetNuiFocus(true, true)
    end
end

exports('MenuShow', MenuShow)